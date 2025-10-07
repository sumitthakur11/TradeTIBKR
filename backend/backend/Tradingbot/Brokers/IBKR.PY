
from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any, Dict, Optional, List
import time
import logging
import requests

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class IBKRError(Exception):
    """Generic IBKR client error."""


class IBKRRequestError(IBKRError):
    """Raised when an HTTP request to IBKR fails with non-2xx status."""


@dataclass
class Order:
    symbol: str
    qty: float
    side: str 
    order_type: str = "MKT" 
    price: Optional[float] = None
    time_in_force: str = "DAY"

    def to_payload(self) -> Dict[str, Any]:
        payload = {
            "symbol": self.symbol,
            "qty": self.qty,
            "side": self.side,
            "type": self.order_type,
            "time_in_force": self.time_in_force,
        }
        if self.price is not None:
            payload["price"] = self.price0
        return payload


@dataclass
class AccountSummary:
    account_id: str
    currency: str
    net_liquidation: float
    available_cash: Optional[float] = None


class IBKRClient:
 

    def __init__(
        self,
        data,
        timeout: int = 10,
        max_retries: int = 3,
        retry_backoff: float = 0.5,
    ) -> None:
        self.base_url = ''
        self.session = requests.Session()
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_backoff = retry_backoff

        if data.apikey:
            self.session.headers.update({"Authorization": f"Bearer {data.apikey}"})

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/') }"

    def _request(self, method: str, path: str, **kwargs) -> Any:
        url = self._url(path)
        last_exc: Optional[Exception] = None
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.debug("%s %s (attempt %d)", method, url, attempt)
                resp = self.session.request(method, url, timeout=self.timeout, **kwargs)
                if 200 <= resp.status_code < 300:
                    if resp.headers.get("content-type", "").startswith("application/json"):
                        return resp.json()
                    return resp.text
                # non-2xx
                raise IBKRRequestError(
                    f"{method} {url} returned {resp.status_code}: {resp.text}"
                )
            except (requests.RequestException, IBKRRequestError) as exc:
                last_exc = exc
                logger.warning("Request failed (%s). attempt=%d/%d", exc, attempt, self.max_retries)
                if attempt < self.max_retries:
                    time.sleep(self.retry_backoff * attempt)
                else:
                    logger.error("Giving up after %d attempts", attempt)
        raise last_exc or IBKRError("Unknown request failure")

    
    def authenticate(self, username: str, password: str) -> Dict[str, Any]:
        
        payload = {"username": username, "password": password}
        resp = self._request("POST", "/auth/login", json=payload)
        token = None
        if isinstance(resp, dict):
            token = resp.get("access_token") or resp.get("token")
        if token:
            self.session.headers.update({"Authorization": f"Bearer {token}"})
        return resp

    def logout(self) -> Any:
        return self._request("POST", "/auth/logout")

    def get_account_summary(self, account_id: str) -> AccountSummary:
        data = self._request("GET", f"/accounts/{account_id}/summary")
        return AccountSummary(
            account_id=account_id,
            currency=data.get("currency", "USD"),
            net_liquidation=float(data.get("net_liquidation", 0)),
            available_cash=float(data.get("available_cash", 0)) if data.get("available_cash") is not None else None,
        )

    def get_positions(self, account_id: str) -> List[Dict[str, Any]]:
        return self._request("GET", f"/accounts/{account_id}/positions")

    # --- orders ---
    def place_order(self, account_id: str, order: Order) -> Dict[str, Any]:
        payload = order.to_payload()
        return self._request("POST", f"/accounts/{account_id}/orders", json=payload)

    def get_orders(self, account_id: str, status: Optional[str] = None) -> List[Dict[str, Any]]:
        params = {"status": status} if status else None
        return self._request("GET", f"/accounts/{account_id}/orders", params=params)

    def cancel_order(self, account_id: str, order_id: str) -> Dict[str, Any]:
        return self._request("DELETE", f"/accounts/{account_id}/orders/{order_id}")

    # --- market data ---
    def get_market_quote(self, symbol: str) -> Dict[str, Any]:
        return self._request("GET", f"/market/quotes/{symbol}")

    def get_historical(self, symbol: str, start: str, end: Optional[str] = None, timeframe: str = "1D") -> Any:
        params = {"start": start, "timeframe": timeframe}
        if end:
            params["end"] = end
        return self._request("GET", f"/market/historical/{symbol}", params=params)


if __name__ == "__main__":
    # Example usage (won't be executed on import). Replace base_url with your gateway.
    client = IBKRClient(base_url="http://localhost:5000", api_key=None)
    print("IBKRClient created; configure and call methods as needed.")
