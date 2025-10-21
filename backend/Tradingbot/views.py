from django.shortcuts import render
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics,permissions,status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import GenericAPIView,UpdateAPIView
from rest_framework.decorators import api_view

from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token


from . import serializers as ser 
from . import models as md
import datetime
from . import env
import os
import pathlib
path = pathlib.Path(__file__).resolve().parent.parent
logpath= os.path.join(path,'Botlogs/Frontendlog.logs')
logpath= os.path.normpath(logpath)
import json
import pytz
import time
from .utility import get_tokens_for_user,verify_token
# optional third-party SDK - if not installed, fall back to None and handle gracefully
from .utility import IBKR
from django.http import JsonResponse, FileResponse, Http404
import locale
from rest_framework.exceptions import ValidationError as DRFValidationError
import traceback
# from .utility import utility

print(logpath,'logpath')
logger=env.setup_logger(logpath)

# Create your views here.
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})








class LoginAPI(KnoxLoginView):
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)

    # @csrf_exempt
    def post(self, request, format=None):
            try:
                serializer = AuthTokenSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.validated_data['user']
            
                login(request, user)
                
                user_login = super(LoginAPI, self).post(request, format=None)
                format= '%Y-%m-%dT%H:%M:%S.%f%z'
                user_login.data['expiry']= datetime.datetime.strptime(user_login.data['expiry'],format).timestamp()
                print(user_login.data)
                logger.info("Login Sucessfull")

                return Response({"message":user_login.data,
                                "id":user.id},
                                status=status.HTTP_200_OK)
                
            except DRFValidationError as e:
                # DRF ValidationError -> return its serializable .detail
                logger.warning(f'Validation error during login: {e}')
                return Response({
                            "message": e.detail,
                            "code": status.HTTP_400_BAD_REQUEST
                        },  
                        status=status.HTTP_400_BAD_REQUEST)
            except Exception as e :
                # Ensure exception is converted to a serializable form (string)
                logger.error(traceback.format_exc())
                return Response({
                            "message": str(e),
                            "code": status.HTTP_400_BAD_REQUEST
                        },  
                        status=status.HTTP_400_BAD_REQUEST)


class broker(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            users = request.user
            if request.GET.get('broker').lower()=='IBKR':
                proj= md.Broker.objects.filter(user=users.id,brokername='IBKR').values('brokerid','nickname','Username','accountnumber','brokername','active','apikey','password',
                                                                 'AuthToken')

            elif request.GET.get('broker').lower()=='angel':
                proj= md.Broker.objects.filter(user=users.id,brokername='ANGEL').values('brokerid','nickname','accountnumber','brokername','active','apikey','password','secretkey','AuthToken')
            
            else:
                proj = []
            if request.GET.get('account').lower()=='all':
                proj= md.Broker.objects.filter(user=users.id,valid=True,brokername=request.GET.get('broker').upper()).values('brokerid','nickname','accountnumber','brokername')
            

            
            return Response({"message":proj})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)


    # @csrf_exempt
    def post(self, request):
        user = request.user
        data=dict()
        try:
            if not request.data.get('brokerid'):

                print(request.data)
                request.data['brokername']=request.data.get('brokerName')
                request.data['user']= user.id
                tokens = get_tokens_for_user(request.user, accountnumber=request.data.get('accountnumber'))
                request.data['access_token']= tokens['access']
                request.data['refresh_token']= tokens['refresh']

                serialize = ser.Broker(data=request.data)

                if serialize.is_valid(raise_exception=True):
                        serialize.save()
                
            
                logger.info('Broker added sucessfully')
                
                return Response({"Message":'sucessfl'},status=status.HTTP_200_OK)


          
           
           

            
        except Exception as e:
            logger.error(e)
            
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        

    def put(self, request, *args, **kwargs):
        """
        Update the profile
        user.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        try:

            user = request.user
            print(request.data)
            put=request.data.get('put')
            if not put :
                proj= md.Broker.objects.filter(brokerid=request.data.get('brokerid')).last()
                proj.active= False if proj.active else True
                print(proj.brokername)
                if proj.brokername=='GROWW':    
                    proj.valid=True
                if proj.brokername=='DHAN':    
                    proj.valid=True

                proj.save()

            else :
                    serialize = ser.Broker(data=request.data)
                    serialize.is_valid(raise_exception=True)
                    valuessetbr = serialize.validated_data
                    md.Broker.objects.filter(brokerid=request.data.get('brokerid')).update(**valuessetbr)
                    print(put)

            logger.info('Broked saved')

                

                
            
        
            return Response(
                {"Message": "Successfully Updated Attendance"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,*args,**kwargs):
        try:

            user = request.user
              
            print(request.GET.get('brokerid'))
            if int(request.GET.get('brokerid')) == 0:

                block= md.Broker.objects.filter(user=user.id,brokerid=request.GET.get('brokerid'))
                for i in block:
                 

                    i.delete()
            else:
              block=  md.Broker.objects.filter(user=user.id,brokerid=request.GET.get('brokerid')).last()
              block.delete()    

            return Response({"message":'deleted'})
            
        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)


brokerlist=[
    {"NAME":"IBKR"},
  



    
]





class Getsymbols(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):


        try:
            users = request.user
            
            data = []
            data1 = dict()
            exchange = (request.GET.get('exchange') or '').upper()
            instrument = (request.GET.get('instrument') or '').upper()
            name = (request.GET.get('name') or '')
            broker_param = (request.GET.get('Broker') or '').lower()

           
            datas = []

            if broker_param == 'ibkr':
               
                if IBKR:
                    try:
                        datas = IBKR.optionchain(name.upper(), exchange.upper(), instrument.upper())
                        print("@@@@@@@@@@@", datas)
                    except Exception as e:
                        logger.error(f"IBKR.optionchain error: {e}")
                        datas = []
                else:
                    datas = []

            
            return Response({"message": datas}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)


class placeorder (GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):


        try:
            users = request.user
            # dash=utility(users)
            oderids= request.GET.get('selectedRows')
            oderids= eval(oderids)
            print(type(oderids),oderids)
            # dash.cancel_order(oderids)

            
           



            return Response({"message":'ok'},status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)






    def post(self, request):
        user = request.user
        try:
            print("Incoming Data:", request.data)

            
            data = {
                "user": user.id,
                "broker": request.data.get("brokerName4"),
                "exchange": request.data.get("exchange"),
                "instrument": request.data.get("instrument"),
                "tradingsymbol": request.data.get("selectsymbol"),
                "ltp": request.data.get("price"),
                "symboltoken": request.data.get("token"),
                "quantity": request.data.get("quantity"),
                "ordertype": request.data.get("orderType"),
                "product_type": request.data.get("product"),
                "transactiontype": request.data.get("side"),
                "account": json.dumps(request.data.get("accountname")),  # store as JSON string if it's a list
                "discloseqty": request.data.get("discloseqty"),
                "lotsize": request.data.get("lotsize"),
                "orderstatus": "PENDING",
            }

            
            allowed_fields = [f.name for f in md.orderobject._meta.get_fields()]
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields}

            order = md.orderobject.objects.create(**filtered_data)


            
            if request.data.get("modify") and request.data.get("orderid"):
                existing = md.orderobject.objects.filter(id=request.data.get("orderid")).first()
                if existing:
                    for key, value in data.items():
                        setattr(existing, key, value)
                    existing.save()
                    order = existing

            # ✅ Return success
            return Response(
                {
                    "message": "Order saved successfully",
                    "order_id": order.id,
                    "order_data": {
                        "tradingsymbol": order.tradingsymbol,
                        "quantity": order.quantity,
                        "ltp": order.ltp,
                        "ordertype": order.ordertype,
                        "product_type": order.product_type,
                        "transactiontype": order.transactiontype,
                        "broker": order.broker,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(traceback.format_exc())
            print(e)
            return Response(
                {"Message": str(e), "code": status.HTTP_400_BAD_REQUEST},
                status=status.HTTP_400_BAD_REQUEST,
            )


class loginbroker (GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        user = request.user
        data=dict()
        try:

       
        
            data['brokerid'] = request.data.get("brokerid")


            print(user.id)
            # dash=utility(user)
            # oid=dash.loginbroker(data)

          
           
           

            
            return Response({"message":"successful" },status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(e)
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )

class loginbrokerredirect (GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):


        try:
            user = request.user

            data= dict()
            data['brokerid'] = request.GET.get("brokerid")
            # dash=utility(user)
            # oid=dash.loginbroker(data)
            time.sleep(2)
            db = md.Broker.objects.filter(brokerid=data['brokerid']).last()
            print(db.url,'urlssssssssssssssssssssssssssssssssssssssssssssss')
           



            return Response({"message":db.url},status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)




    def post(self, request):
        user = request.user
        data=dict()
        try:

       
        
            data['brokerid'] = request.data.get("brokerid")
            print(request.data)
            db = md.Broker.objects.filter(brokerid=int(data['brokerid'])).last()
            db.AuthToken=  request.data.get("accesstoken")
            db.save()


          
           
           

            
            return Response({"message":'ok' },status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(e)
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )




class logoutbroker (GenericAPIView):
    def post(self, request):
        user = request.user
        data=dict()
        try:


            # dash=utility(user)
            data['broker'] = request.data.get("brokerName3")
            # oid=dash.logoutbroker(data)
            return Response({"message":"successful" },status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    def get(self, request, *args, **kwargs):


        try:
            user = request.user

            data= dict()
            data['broker'] = request.GET.get("brokerName3")
            # dash=utility(user)
            # oid=dash.logoutbroker(data)

            return Response({"message":"successful" },status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST
                )


class postionsobj(GenericAPIView):
    # Token auth disabled to allow unauthenticated POSTs
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get(self, request, *args, **kwargs):
        try:
            finaldata= []
            users = request.user
            data = dict()
            start= datetime.datetime.now(tz= pytz.timezone('Asia/Kolkata')).replace(hour=23, minute=59, second=0, microsecond=0)
            end = start- datetime.timedelta(days=1)
            print(end,start)
            # dash=utility(users)
            
            # dash.orderstatus()

            if  request.GET.get('type')== "all":
                data = list(md.orderobject.objects.filter(user=users.id,updated_at__range=(end,start)).values('id','nickname','tradingsymbol','transactiontype','quantity','filledqty','avg_price','orderstatus','remarks','ltp',
                                                                      'ordertype','exchange','orderid','updated_at','broker','side','instrument',))
                
                

            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        try:
            user = request.user
           
            if not user or getattr(user, 'is_anonymous', True):
                return Response({"message": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

            incoming = request.data
            print("incommingssssssssssssssss", incoming)

            
            allowed = [f.name for f in md.orderobject._meta.get_fields()]
            filtered = {k: v for k, v in incoming.items() if k in allowed}
            filtered['user'] = user.id

            order = md.orderobject.objects.create(**filtered)

        
            return Response({"message": "ok", "order_id": order.id}, status=status.HTTP_200_OK)
        except Exception as e:
            print("##########", e)
            return Response({
                    "message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def put(self, request):
        try:
            user = request.user
            incoming = request.data
            order_id = incoming.get("id")
    
            if not order_id:
                return Response({"message": "Order ID required"}, status=status.HTTP_400_BAD_REQUEST)
    
            # filter by the IntegerField 'user' using the numeric id
            order = md.orderobject.objects.filter(id=order_id, user=user.id).first()
            if not order:
                return Response({"message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    
            # Update fields
            for key, value in incoming.items():
                # Never allow changing primary id or the user foreign/int field from request body
                if key in ('id', 'user'):
                    continue
                if hasattr(order, key):
                    setattr(order, key, value)
            order.save()
    
            return Response({"message": "Order updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class loadaccount(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):


        try:
            users = request.user
            data= []
            print(request.GET.get('broker'))
            data1= dict()

            broker_raw = request.GET.get('broker')
            broker_lc = (broker_raw or '').lower()
            broker_up = (broker_raw or '').upper()

           
            datas = []

            if broker_lc == 'all':
                datas = brokerlist
            elif broker_lc == 'ibkr':
                datas = md.Broker.objects.filter(user=users.id,brokername='IBKR').values('valid','brokerid','nickname','brokername','accountnumber','apikey','secretkey','password','AuthToken','active')
            elif broker_lc == 'angel':
                datas = md.Broker.objects.filter(user=users.id,brokername='ANGEL').values('valid','brokerid','nickname','accountnumber','brokername','active','apikey','password','secretkey','AuthToken')
            elif broker_lc == 'fyers':
                datas = md.Broker.objects.filter(user=users.id,brokername='FYERS').values('valid','brokerid','nickname','accountnumber','secretkey','AuthToken','active')
            elif broker_lc == 'motilal':
                datas = md.Broker.objects.filter(user=users.id,brokername='MOTILAL').values('valid','brokerid','nickname','nickname','accountnumber','vendorcode','password','AuthToken','apikey','active')
            elif broker_lc == 'groww':
                datas = md.Broker.objects.filter(user=users.id,brokername='GROWW').values('valid','brokerid','nickname','apikey','secretkey','active')
            elif broker_lc == 'dhan':
                datas = md.Broker.objects.filter(user=users.id,brokername='DHAN').values('valid','brokerid','nickname','accountnumber','AuthToken','active','password')
            elif broker_lc == 'upstox':
                datas = md.Broker.objects.filter(user=users.id,brokername='UPSTOX').values('valid','brokerid','nickname','accountnumber','AuthToken','active','apikey','secretkey')
            elif broker_up == 'ALICEBLUE':
                datas = md.Broker.objects.filter(user=users.id,brokername='ALICEBLUE').values('valid','brokerid','nickname','accountnumber','active','apikey','AuthToken','secretkey','password')
            elif broker_up in ('ZERODHA', 'STOXKART', 'FLATTRADE'):
                datas = md.Broker.objects.filter(user=users.id,brokername=broker_up).values('valid','brokerid','nickname','accountnumber','active','AuthToken','apikey','secretkey','password')
            elif broker_up in ('HDFC', 'SYMPHONY'):
                datas = md.Broker.objects.filter(user=users.id,brokername=broker_up).values('valid','brokerid','nickname','url','accountnumber','active','AuthToken','apikey','secretkey')
            elif broker_up == 'SAMCO':
                datas = md.Broker.objects.filter(user=users.id,brokername=broker_up).values('valid','brokerid','nickname','accountnumber','active','password','secretkey')

            # datas is always defined (possibly empty) at this point
            return Response({"message": datas})

        except Exception as e:
            print(e)
            logger.error(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)


class sendlog(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):


        try:
            users = request.user
            data= []
            
            with open (logpath) as file:
                # data= json.load(file)
                data=file.readlines()[-1000:]

                file.close
                # data.reverse()

            


            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)
def format_in_indian_style(amount):
    s = str(amount)
    if '.' in s:
        before, after = s.split('.')
    else:
        before, after = s, None

    last3 = before[-3:]
    rest = before[:-3]
    if rest:
        rest = ",".join([rest[max(i - 2, 0):i] for i in range(len(rest), 0, -2)][::-1])
        formatted = rest + "," + last3
    else:
        formatted = last3

    if after:
        formatted += '.' + after

    return formatted


class getfunds(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            data = dict()
            
            datalist = md.Broker.objects.filter(user=user.id,valid= True).values('brokername','nickname','accountnumber','funds')
            # print(data)
            # ensure we return a list of dicts even if query returns empty
            if  request.GET.get('type')== "all":
                data = list(datalist)

            return Response({"message":data})
            
           



            

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        try:
            user = request.user
            # require authentication
            if not user or getattr(user, 'is_anonymous', True):
                return Response({"message": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

            incoming = request.data
            print("Incomingssss fundssssss", incoming)

            brokername = incoming.get("brokername")
            funds_value = incoming.get("funds", "0.00")

            # try to find existing broker for this user
            broker_obj = md.Broker.objects.filter(user=user.id, brokername=brokername).last()

            # if not found, create a new broker record so funds can be stored
            if not broker_obj:
                broker_obj = md.Broker.objects.create(
                    user=user.id,
                    brokername=brokername,
                    nickname=incoming.get("nickname") or None,
                    accountnumber=incoming.get("accountnumber") or None,
                    funds=funds_value,
                    valid=True,
                )
                logger.info(f"Created new Broker record for user={user.id} broker={brokername}")
                return Response({"message": "Broker created and funds set", "brokerid": broker_obj.brokerid}, status=status.HTTP_201_CREATED)

            # update existing broker's funds
            broker_obj.funds = funds_value
            broker_obj.save()

            return Response({"message": "Funds updated successfully", "brokerid": broker_obj.brokerid}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request):
        try:
            user = request.user
            incoming = request.data
            broker_id = incoming.get("brokerid")

            if not broker_id:
                return Response({"message": "brokerid required"}, status=status.HTTP_400_BAD_REQUEST)

            broker = md.Broker.objects.filter(user=user.id, brokerid=broker_id).first()
            if not broker:
                return Response({"message": "Broker not found"}, status=status.HTTP_404_NOT_FOUND)

            for key, value in incoming.items():
                if hasattr(broker, key):
                    setattr(broker, key, value)
            broker.save()

            return Response({"message": "Broker record updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class getposition(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            data = dict()

            # dash=utility(user)

            # oid=dash.getposition()
            datalist = md.Allpositions.objects.filter(user=user.id).values('nickname','tradingsymbol','netqty','buyavgprice','sellavgprice','ltp','broker','realised','unrealised')
            

            return Response({"message":datalist})



        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)
            
    def post(self, request):
        try:
            user = request.user
            data = request.data
            print("Incomingssss positionsssssss", data)
            data['user'] = user.id 
            
            position = md.Allpositions.objects.create(**data)
            
            return Response({"message":"ok", "position_id": position.id},status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    
    def put(self, request, *args, **kwargs):
        try:
            user = request.user
            incoming = request.data 
            position_id = incoming.get("id")
            
            if not position_id:
                return Response({"message": "Position ID required"}, status=status.HTTP_400_BAD_REQUEST)
            
            position = md.Allpositions.objects.filter(id=position_id, user = user.id).first()
            if not position:
                return Response({"message": "Position not found"}, status=status.HTTP_404_NOT_FOUND)
            
            for key, value in incoming.items():
                if hasattr(position, key):
                    setattr(position, key, value)
            position.save()
            return Response({"message": "Position updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            


class getholding(GenericAPIView):
    
    
    authentication_classes= (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user

            # dash=utility(user)

            # oid=dash.getholding()
            data = md.allholding.objects.filter(user=user.id).values('nickname','broker','tradingsymbol','quantity','T1quantity','averageprice','ltp','profitandloss')
            
            


            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)
            
    def post(self, request):
        try:
            user = request.user
            data = request.data
            # dash=utility(user)
            # oid=dash.getholding()
            
            print("Incomingssss holdingsssssss", data)
            
            data['user'] = user.id 
            holding = md.allholding.objects.create(**data)
            return Response({"message":"ok", "holding_id": holding.id},status=status.HTTP_200_OK)
           
        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, *args, **kwargs):
        
        try:

            user = request.user
            incomming = request.data
            holding_id = incomming.get('id')
            
            if not holding_id:
                return Response({"message": "Holding ID required"}, status=status.HTTP_400_BAD_REQUEST)
            
           
            holding = md.allholding.objects.filter(id=holding_id, user = user.id).first()
            if not holding:
                return Response({"message": "Holding not found"}, status=status.HTTP_404_NOT_FOUND)
            
            for key, value in incomming.items():
                if hasattr(holding, key):
                    setattr(holding, key, value)
            holding.save()

            logger.info('Holding updated')
            
                

                
            return Response(
                {"Message": "Successfully Updated Holding"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)

class GetLogs(GenericAPIView):
    serializer_class = ser.LogSerializer

    def get(self, request):
        try:
            account_no = request.GET.get('account_no') or request.GET.get('accountnumber')

            logs_qs = md.LogEntry.objects.all().order_by('-updated_at')

            if not logs_qs.exists():
                sample_logs = [
                    {
                        'type': 'SYSTEM',
                        'description': 'Sample system initialization log',
                        'severity': 'INFO',
                        'accountnumber': '0001',
                    },
                    {
                        'type': 'TRADE',
                        'description': 'Sample trade executed: BUY 10 ABC',
                        'severity': 'DEBUG',
                        'accountnumber': '0001',
                    },
                    {
                        'type': 'USER',
                        'description': 'Sample user action: created watchlist',
                        'severity': 'WARNING',
                        'accountnumber': '0002',
                    },
                ]
                for item in sample_logs:
                    try:
                        md.LogEntry.objects.create(**item)
                    except Exception as e:
                        
                        print("Error creating sample log entry:", e)

                
                logs_qs = md.LogEntry.objects.all().order_by('-updated_at')

            if account_no:
                logs_qs = logs_qs.filter(accountnumber=account_no)

            serializer = self.get_serializer(logs_qs, many=True)
            return Response({"message": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error in getlogs:", e)
            logger.error(traceback.format_exc())
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

# @method_decorator(csrf_exempt, name='dispatch')

def verify_account_token(access_token):
    
    try:
        token_verification = verify_token(access_token)

        if (not token_verification.get('valid')) or (datetime.datetime.fromtimestamp(token_verification.get('exp')) < datetime.datetime.now(tz=pytz.timezone("UTC"))):
            return False, None, f"Invalid token: {token_verification.get('error')}"
        broker = md.Broker.objects.filter(accountnumber=token_verification['accountno']).last()
        return True,broker , None
      
    except Exception as e:
        logger.error(f"Error in verify_account_token: {e}")
        logger.error(traceback.format_exc())
        return False, None, str(e)



class publicorderdata(GenericAPIView):
   
    permission_classes = (AllowAny,)
    
    def post(self, request):
        try:
            accountnumber = request.data.get('accountnumber')
            # auth_token = request.data.get('auth_token')
  
            is_valid, broker, error_msg = verify_account_token(accountnumber)
            
            if not is_valid:
                logger.warning(f"Unauthorized order data request: {error_msg}")
                return Response({
                    "message": error_msg, "code": status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
            data = request.data.get('data')
            for i in data:

                order_data = {
                'user': broker.user,
                'broker': broker.brokername,
                'accountnumber': broker.accountnumber,
                'nickname': broker.nickname,
                'tradingsymbol': i.get('tradingsymbol'),
                'exchange': i.get('exchange'),
                'instrument': i.get('instrument'),
                'symboltoken': i.get('symboltoken'),
                'ordertype': i.get('ordertype'),
                'transactiontype': i.get('transactiontype'),
                'product_type': i.get('product_type'),
                'quantity': i.get('quantity'),
                'ltp': i.get('ltp'),
                'avg_price': i.get('avg_price'),
                'orderid': i.get('orderid'),
                'orderstatus': i.get('orderstatus', 'PENDING'),
                'filledqty': i.get('filledqty', 0),
                'side': i.get('side'),
                'remarks': i.get('remarks', ''),
                'discloseqty': i.get('discloseqty'),
                'lotsize': i.get('lotsize'),}
            
                existing_order = md.orderobject.objects.filter(orderid=i['orderid'],).last()
            
                if existing_order:
                    for key, value in i.items():
                        setattr(existing_order, key, value)
                    existing_order.save()
                    
                    logger.info(f"Order updated via public API - Account: {accountnumber}, OrderID: {order_data.get('orderid')}")
                
                    return Response({
                        "message": "Order updated successfully",
                        "order_id": existing_order.id,
                        "orderid": existing_order.orderid
                    }, status=status.HTTP_200_OK)
                else:
                    order = md.orderobject.objects.create(**i)
                
                    logger.info(f"Order created via public API - Account: {accountnumber}, OrderID: {order.id}")

                    return Response({
                        "message": "Order created successfully",
                        "order_id": order.id,
                        "orderid": order.orderid if hasattr(order, 'orderid') else order.id
                    }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error in PublicOrderDataAPI: {e}")
            logger.error(traceback.format_exc())
            return Response({
                "message": str(e),
                "code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)





class publicpositiondata(GenericAPIView):
    
    permission_classes = (AllowAny,)
    
    def post(self, request):
        try:
            accountnumber = request.data.get('accountnumber')
            # auth_token = request.data.get('auth_token')

            is_valid, broker, error_msg = verify_account_token(accountnumber)
            
            if not is_valid:
                logger.warning(f"Unauthorized position data request: {error_msg}")
                return Response({
                    "message": error_msg,
                    "code": status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            data = request.data.get('data')
            for i in data:
            # Extract position data
                position_data = {
                    'user': broker.user,
                    'broker': broker.brokername,
                    'nickname': broker.nickname,
                    'tradingsymbol': i.data.get('tradingsymbol'),
                    'netqty': i.data.get('netqty', 0),
                    'buyavgprice': i.data.get('buyavgprice', 0),
                    'sellavgprice': i.data.get('sellavgprice', 0),
                    'ltp': i.data.get('ltp', 0),
                    'realised': i.data.get('realised', 0),
                    'unrealised': i.data.get('unrealised', 0),
                }

            # position_data = {k: v for k, v in position_data.items() if v is not None}

                existing_position = md.Allpositions.objects.filter(
                    user=broker.user,
                    broker=broker.brokername,
                    tradingsymbol=position_data.get('tradingsymbol')
                ).first()
            
                if existing_position:

                    for key, value in position_data.items():
                        setattr(existing_position, key, value)
                    existing_position.save()

                    logger.info(f"Position updated via public API - Account: {accountnumber}, Symbol: {position_data.get('tradingsymbol')}")

                    return Response({
                        "message": "Position updated successfully",
                        "position_id": existing_position.id
                    }, status=status.HTTP_200_OK)
                else:

                    position = md.Allpositions.objects.create(**position_data)

                    logger.info(f"Position created via public API - Account: {accountnumber}, Symbol: {position_data.get('tradingsymbol')}")

                    return Response({
                        "message": "Position created successfully",
                        "position_id": position.id
                    }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error in PublicPositionDataAPI: {e}")
            logger.error(traceback.format_exc())
            return Response({
                "message": str(e),
                "code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)


class publicholdingdata(GenericAPIView):
    
    permission_classes = (AllowAny,)
    
    def post(self, request):
        try:
            accountnumber = request.data.get('accountnumber')
            # auth_token = request.data.get('auth_token')
            
            is_valid, broker, error_msg = verify_account_token(accountnumber)
            
            if not is_valid:
                logger.warning(f"Unauthorized holdings data request: {error_msg}")
                return Response({
                    "message": error_msg,
                    "code": status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
                
            data = request.data.get('data')
            for i in data:

                holdings_data = {
                    'user': broker.user,
                    'broker': broker.brokername,
                    'nickname': broker.nickname,
                    'tradingsymbol': i.data.get('tradingsymbol'),
                    'quantity': i.data.get('quantity', 0),
                    'T1quantity': i.data.get('T1quantity', 0),
                    'averageprice': i.data.get('averageprice', 0),
                    'ltp': i.data.get('ltp', 0),
                    'profitandloss': i.data.get('profitandloss', 0),
                }

            # holdings_data = {k: v for k, v in holdings_data.items() if v is not None}
            
                existing_holding = md.allholding.objects.filter(
                    user=broker.user,
                    broker=broker.brokername,
                    tradingsymbol=holdings_data.get('tradingsymbol')
                ).first()

                if existing_holding:

                    for key, value in holdings_data.items():
                        setattr(existing_holding, key, value)
                    existing_holding.save()

                    logger.info(f"Holding updated via public API - Account: {accountnumber}, Symbol: {holdings_data.get('tradingsymbol')}")

                    return Response({
                        "message": "Holding updated successfully",
                        "holding_id": existing_holding.id
                    }, status=status.HTTP_200_OK)
                else:
                    holding = md.allholding.objects.create(**holdings_data)

                    logger.info(f"Holding created via public API - Account: {accountnumber}, Symbol: {holdings_data.get('tradingsymbol')}")

                    return Response({
                        "message": "Holding created successfully",
                        "holding_id": holding.id
                    }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error in PublicHoldingsDataAPI: {e}")
            logger.error(traceback.format_exc())
            return Response({
                "message": str(e),
                "code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)


class publicgetorderreq(GenericAPIView):
    
    permission_classes = (AllowAny,)
    
    def post(self, request):
        try:
            accountnumber = request.data.get('accountnumber')
            # auth_token = request.data.get('auth_token')

            is_valid, broker, error_msg = verify_account_token(accountnumber)
            
            if not is_valid:
                logger.warning(f"Unauthorized get orders request: {error_msg}")
                return Response({
                    "message": error_msg,
                    "code": status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
                
            order_ids = request.data.get('order_ids') 
            orderid_list = request.data.get('orderid_list')
        
            order_status = request.data.get('orderstatus')  
            days = request.data.get('days', 1)  
  
            end_time = datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata'))
            start_time = end_time - datetime.timedelta(days=int(days))
 
            orders_qs = md.orderobject.objects.filter(
                user=broker.user,
                updated_at__range=(start_time, end_time)
            )
            if order_ids:
                if isinstance(order_ids, str):
                    order_ids = [int(x.strip()) for x in order_ids.split(',') if x.strip().isdigit()]
                orders_qs = orders_qs.filter(id__in=order_ids)
            
            
            if orderid_list:
                if isinstance(orderid_list, str):
                    orderid_list = [x.strip() for x in orderid_list.split(',') if x.strip()]
                orders_qs = orders_qs.filter(orderid__in=orderid_list)
        
            if order_status:
                orders_qs = orders_qs.filter(orderstatus=order_status)
            
            # Get values
            orders = list(orders_qs.values(
                'id', 'nickname', 'tradingsymbol', 'transactiontype', 
                'quantity', 'filledqty', 'avg_price', 'orderstatus', 
                'remarks', 'ltp', 'ordertype', 'exchange', 'orderid', 
                'updated_at', 'broker', 'side', 'instrument'
            ))
            
            logger.info(f"Orders retrieved via public API - Account: {accountnumber}, Count: {len(orders)}")
            
            return Response({
                "message": "Orders retrieved successfully",
                "accountnumber": accountnumber,
                "count": len(orders),
                "orders": orders
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in PublicGetOrderRequestAPI: {e}")
            logger.error(traceback.format_exc())
            return Response({
                "message": str(e),
                "code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)

class getpublicplaceorder(GenericAPIView):
    permissions_classes = (AllowAny,)
    
    def get(self, request):
        try:
            accountnumber = request.GET.get('accountnumber')
            # auth_token = request.GET.get('auth_token')

            is_valid, broker, error_msg = verify_account_token(accountnumber)
            
            if not is_valid:
                logger.warning(f"Unauthorized place order request: {error_msg}")
                return Response({
                    "message": error_msg,
                    "code": status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            orders_qs = md.orderobject.objects.filter(
                user=broker.user
            ).order_by('-updated_at')
            
            orders = list(orders_qs.values(
                'id', 'nickname', 'tradingsymbol', 'transactiontype', 
                'quantity', 'filledqty', 'avg_price', 'orderstatus', 
                'remarks', 'ltp', 'ordertype', 'exchange', 'orderid', 
                'updated_at', 'broker', 'side', 'instrument'
            ))
            
            logger.info(f"Place order data retrieved via public API - Account: {accountnumber}, Count: {len(orders)}")
            
            return Response({
                "message": "Place order data retrieved successfully",
                "accountnumber": accountnumber,
                "count": len(orders),
                "orders": orders
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in PublicPlaceOrderAPI: {e}")
            logger.error(traceback.format_exc())
            return Response({
                "message": str(e),
                "code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)
            
            
            
        
            
# @method_decorator(csrf_exempt, name='dispatch')           
class getforlogs(GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            accountnumber = request.data.get('AUTH_KEY')
            # auth_token = request.data.get('auth_token')

            is_valid, broker, error_msg = verify_account_token(accountnumber)
            
            if not is_valid:
                print(f"Unauthorized get logs request: {error_msg}")
                return Response({
                    "message": error_msg,
                    "code": status.HTTP_401_UNAUTHORIZED
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            logpath= f"{path}/Botlogs/public/{broker.accountnumber}"
            # print(request.data)
            log_path = os.path.join(logpath, request.data.get('data')['filename'])
            if not os.path.exists(log_path):
                os.makedirs(os.path.dirname(log_path), exist_ok=True)
            log_path= os.path.normpath(log_path)
            with open(log_path, "w", encoding="utf-8") as f:
                    f.write(request.data.get('data')['content'])
                    f.close()
            broker.filename= request.data.get('data')['filename']
            broker.save()
            
            
            ####################
            
            filename = os.path.basename(log_path)
            filehandle = open(log_path,'rb')
            responsehandle = FileResponse(filehandle, content_type = 'application/octet-stream')
            responsehandle['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return responsehandle 



            # return Response({"message": "file updated and created "}, status=status.HTTP_200_OK)
            


               
           
            
        except Exception as e:
            print(f"Error in PublicGetLogsAPI: {e}")
            print(traceback.format_exc())
            return Response({
                "message": str(e),
                "code": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)
            

