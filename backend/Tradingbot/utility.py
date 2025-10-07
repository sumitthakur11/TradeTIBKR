
from abc import ABC, abstractmethod
from Tradingbot import models as md
from Tradingbot import serializers as ser
from Tradingbot import Brokers
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
    serliaze= ser.orderobjectserializer(data=data)
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
        
