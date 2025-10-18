
from abc import ABC, abstractmethod
from Tradingbot import models as md
from Tradingbot import serializers as ser
from Tradingbot import Brokers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError

from django.utils import timezone
import datetime
from datetime import timedelta
import time
class brokermethod(ABC):

    @abstractmethod
    def authenticate(self, data: dict):
        pass

    @abstractmethod
    def orderstatus(self):
        pass

    @abstractmethod
    def cancel_order(self, transaction_id: str):
        pass

    @abstractmethod
    def placeorder(self, orderparams: dict):
        pass

    @abstractmethod
    def makesymbol(self):
        pass
    @abstractmethod
    def placeexitorder(self):
        pass

    
def orderobject(data):
    # serializer class is `orderobject` in serializers.py
    serliaze= ser.orderobject(data=data)
    serliaze.is_valid(raise_exception=True)
    serliaze.save()


def order(func):
    def wrap(self,*args, **kwargs):
        print("Decorator triggered")

        order=md.orderobject.objects.filter(status= True)

        for i in order:
        
            func(self,i)
    return wrap


class IBKR(brokermethod):
    def __init__(self,user):
           self.user = user 
           
    def authenticate(self, data):
        print(data['brokerid'])
        print(self.user)
        br = md.Brokermodel.objects.filter(brokerid=data['brokerid'], user=self.user).last()
        if br :
            

            self.broker = Brokers.IBKR.IBKRClient(br)
            flag, excp = self.broker.login()
            if flag:
                br.valid = True
                br.save()
            else:
                br.valid = False
                br.save()
            return 
        
    def placeorder(self,orderparams):
            

                
                orderid=  []
                placeorders=False
                order_ids= None
                quantity=orderparams['quantity']
                br=md.Brokermodel.objects.filter(active=True,brokerid=orderparams['brokerid']).last()
                if br:
                       
                   

                    setup = Brokers.IBKR.IBKRClient(br)
                    fund,excp=setup.placeorder(orderparams,orderobject)
                    return fund,excp
                
    
    def cancel_order(self,orderblock):
            
               

                    orderobj = md.orderobject.objects.filter(id=orderblock).last()
                    br=md.Brokermodel.objects.filter(active=True,brokerid=orderobj.brokerid).last()
                    if br.valid:
                        setup = Brokers.IBKR.IBKRClient(br)
                        order_ids=setup.cancel_order(orderobj.orderid)
    def assignorder(self,orders):
        pass


    def orderstatus(self):
           

                    account=md.Brokermodel.objects.filter(valid=True,user=self.user)


                    for br in account:

                        if br.valid:
                            
                            setup = Brokers.IBKR.IBKRClient(br)
                            order_ids=setup.orderBook()
                            self.assignorder(order_ids)



                                    

    def makesymbol(self):
        try:
            
           pass
        except Exception as e:
            print(e)
            return None
    

def get_tokens_for_user(user, accountnumber: str | None = None):

    from django.contrib.auth import get_user_model

    User = get_user_model()

    if user is None:
        raise ValueError("user is required")

    # Resolve numeric id to a User instance if necessary
    if not hasattr(user, 'id'):
        try:
            user = User.objects.get(pk=int(user))
        except Exception as e:
            raise ValueError(f"Could not resolve user from value: {user}") from e

    # Create a refresh token for the user
    refresh = RefreshToken.for_user(user)

    # Optionally attach account number claim
    if accountnumber:
        try:
            refresh['accountno'] = str(accountnumber)
        except Exception as e:
            print("Error setting account number in token:", e)
            pass

    access = refresh.access_token
    access.set_exp(from_time=timezone.now() + timedelta(days=360))
    refresh.set_exp(from_time=timezone.now() + timedelta(days=400))

    return {
        'refresh': str(refresh),
        'access': str(access),
    }


def verify_token(token_str: str):

    if not token_str:
        return {'valid': False, 'error': 'No token provided', 'accountno': None, 'exp': None}

    # strip Bearer prefix if present
    if token_str.startswith('Bearer '):
        token_str = token_str.split(' ', 1)[1]

    try:
        token = AccessToken(token_str)
        accountno = token.get('accountno')
        exp = token.get('exp')
        
        if not accountno:
            return {
                'valid': False, 
                'error': 'Token missing accountno claim'
            }
        
        return {'valid': True, 'accountno': str(accountno), 'exp': exp, 'error': None}
    except TokenError as e:
        return {'valid': False, 'error': str(e), 'accountno': None, 'exp': None}

# class utility:
#     """Small compatibility utility used by views. This provides minimal implementations
#     for methods the views call so the app can run in development with dummy data.
#     """
#     def __init__(self,user):
#         self.user = user

#     def checkfunds(self):
        
#         return True

#     def getposition(self):
    
#         return True

#     def getholding(self):
       
#         return True

#     def orderstatus(self):
       
#         return None

#     def loginbroker(self,data):
#         try:
#             br = md.Broker.objects.filter(brokerid=data.get('brokerid')).last()
#             if br:
#                 br.valid = True
#                 br.save()
#             return True
#         except Exception:
#             return False

#     def logoutbroker(self,data):
#         try:
#             br = md.Broker.objects.filter(brokerid=data.get('brokerid')).last()
#             if br:
#                 br.valid = False
#                 br.save()
#             return True
#         except Exception:
#             return False

#     def placeorder(self,data):
        
#         try:
            
#             if hasattr(self.user, 'id') and self.user.id:
#                 user_id = self.user.id
#             else:
#                 try:
#                     user_id = int(self.user)
#                 except Exception:
#                     user_id = None

#             # coerce nickname/accountname to string if it's a list
#             nickname_val = data.get('account') or data.get('accountname') or 'DemoAcct'
#             if isinstance(nickname_val, list):
#                 nickname_val = nickname_val[0] if len(nickname_val) > 0 else 'DemoAcct'

#             obj = {
#                 'user': user_id,
#                 'orderid': data.get('orderid') or None,
#                 'status': True,
#                 'tradingsymbol': data.get('tradingsymbol') or data.get('selectsymbol') or '',
#                 'symboltoken': data.get('symboltoken') or '',
#                 'ordertype': str(data.get('ordertype') or data.get('orderType') or 'MARKET'),
#                 'transactiontype': str(data.get('transactiontype') or data.get('side') or 'BUY'),
#                 'product_type': str(data.get('product_type') or data.get('product') or ''),
#                 'avg_price': float(data.get('ltp') or 0),
#                 'quantity': str(data.get('quantity') or '0'),
#                 'exchange': data.get('exchange') or '',
#                 # don't set an arbitrary default that is not in model choices
#                 # model allows null for broker, so use None when missing
#                 'broker': data.get('broker') or data.get('brokerName4') or None,
#                 'nickname': str(nickname_val),
#                 'side': str(data.get('transactiontype') or data.get('side') or 'BUY'),
#                 'orderstatus': 'Open',
#                 'ltp': float(data.get('ltp') or 0),
#             }
#             seril = ser.orderobject(data=obj)
#             if seril.is_valid():
#                 inst = seril.save()
              
#                 try:
#                     return inst.id
#                 except Exception:
#                     return seril.data
#             else:
               
#                 print('orderobject serializer errors:', seril.errors)
#                 return {'errors': seril.errors, 'data': seril.initial_data}
#         except Exception:
          
#             import traceback
#             traceback.print_exc()
#             return False

#     def modifyorder(self,data):
       
#         try:
#             orderid = data.get('orderid')
#             order = md.orderobject.objects.filter(orderid=orderid).last()
#             if order:
#                 order.tradingsymbol = data.get('tradingsymbol') or order.tradingsymbol
#                 order.quantity = data.get('quantity') or order.quantity
#                 order.save()
#                 return True
#             return False
#         except Exception:
#             return False

#     def cancel_order(self,order_ids):
      
#         try:
           
#             if isinstance(order_ids,str) or isinstance(order_ids,int):
#                 order_ids = [order_ids]
#             for oid in order_ids:
#                 o = md.orderobject.objects.filter(id=oid).last()
#                 if o:
#                     o.status = False
#                     o.orderstatus = 'CANCELED'
#                     o.save()
#             return True
#         except Exception:
#             return False
        
