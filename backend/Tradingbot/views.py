from django.shortcuts import render
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics,permissions,status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import GenericAPIView,UpdateAPIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_protect

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
from django.middleware import csrf
from django.http import JsonResponse
import locale
from rest_framework.exceptions import ValidationError as DRFValidationError
import traceback

print(logpath,'logpath')
logger=env.setup_logger(logpath)

# Create your views here.
def get_csrf_token(request):
    csrf_token = csrf.get_token(request)
    return JsonResponse({'csrfToken': csrf_token})








class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

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
            if request.GET.get('broker').lower()=='shoonya':
                proj= md.Broker.objects.filter(user=users.id,brokername='SHOONYA').values('brokerid','nickname','Username','accountnumber','brokername','active','apikey','password',
                                                                 'vendorcode','AuthToken')

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


    def post(self, request):
        user = request.user
        data=dict()
        try:
            if not request.data.get('brokerid'):

                print(request.data)
                request.data['brokername']=request.data.get('brokerName')
                request.data['user']= user.id
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
            data= []
            data1= dict()
           

            
            exchange = request.GET.get('exchange')
            instrument = request.GET.get('instrument')
            name = request.GET.get('name')
            if request.GET.get('Broker').lower()== "shoonya":
                datas=shoonyasdk.optionchain(name.upper(),exchange.upper(),instrument.upper())
            
                

                # datas = datas.to_dict(orient="records")

            return Response({"message":datas},status=status.HTTP_200_OK)

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
            dash=utility(users)
            oderids= request.GET.get('selectedRows')
            oderids= eval(oderids)
            print(type(oderids),oderids)
            dash.cancel_order(oderids)

            
           



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
        data=dict()
        try:
            print(request.data)
            data['broker']= request.data.get('brokerName4')
            data['exchange'] = request.data.get('exchange')
            data['instrument'] = request.data.get('instrument')
            data['tradingsymbol'] = request.data.get('selectsymbol')
            data['ltp'] = request.data.get('price')
            data['symboltoken'] = request.data.get('token')
            data['quantity'] = request.data.get('quantity')
            data['ordertype'] =request.data.get('orderType')
            data['product_type'] = request.data.get('product')
            data['transactiontype'] = request.data.get('side')
            data['account'] = request.data.get('accountname')
            data['discloseqty'] = request.data.get('discloseqty')
            data['lotsize'] = request.data.get('lotsize')



            
            dash=utility(user)
            if request.data.get('modify'):
                data['orderid']= request.data.get('orderid')
                oid=dash.modifyorder(data)
            else :
                oid=dash.placeorder(data)

            
            
                    
            

          
           
           

            
            return Response({"message":"successful" },status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(e)
            print(e)
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
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
            dash=utility(user)
            oid=dash.loginbroker(data)

          
           
           

            
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
            dash=utility(user)
            oid=dash.loginbroker(data)
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


            dash=utility(user)
            data['broker'] = request.data.get("brokerName3")
            oid=dash.logoutbroker(data)
                    
            

          
           
           
    
            
            return Response({"message":"successful" },status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class postionsobj(GenericAPIView):
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
            dash=utility(users)
            
            dash.orderstatus()

            if  request.GET.get('type')== "all":
                data=md.orderobject.objects.filter(user=users.id,updated_at__range=(end,start)).values('id','nickname','tradingsymbol','transactiontype','quantity','filledqty','avg_price','orderstatus','remarks','ltp',
                                                                      'ordertype','exchange','orderid','updated_at','broker','side','instrument',)
                
                # data['sid']=data['id']
                

            
            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)

class watchlist(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            users = request.user
            data =dict()
            proj= md.Broker.objects.filter(user=users.id).values('id','Username','accountnumber','brokername','value')
            
            print(proj) 
            return Response({"message":proj})

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
            print(request.data)
            request.data['broker']=request.data.get('brokerName4')
            request.data['tradingsymbol']=request.data.get('selectsymbol')
            request.data['symboltoken']=request.data.get('token')
            request.data['exchange']=request.data.get('exchange')
            request.data['user']= user.id
            request.data['subscribe']= True
            request.data['newevent']= True
            

            
            serialize = ser.watchlist(data=request.data)
            if serialize.is_valid(raise_exception=True):
                    serialize.save()
            
        
            
            return Response({"Message":'sucessfl'},status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            logger.error(e)
            return Response({
                    "Message": str(e),
                    "code": status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    def delete(self,request,*args,**kwargs):
        try:

            user = request.user
              
            print(request.GET.get('id'))

            if request.GET.get('brokername')=='SAMCO':
                block= md.watchlist.objects.filter(user=user.id,broker=request.GET.get('brokername'),tradingsymbol=request.GET.get('ts'))
                if block:
                    
                    for i in block:
                        i.subscribe=False
                        i.newevent=True

                        i.save()


            elif int(request.GET.get('id')) == 0:

                block= md.watchlist.objects.filter(user=user.id,broker=request.GET.get('brokername'),id=int(request.GET.get('id')))
                if block :

                    for i in block:
                        i.subscribe=False
                        i.newevent=True

                        i.save()
            else:
              block=  md.watchlist.objects.filter(user=user.id,broker=request.GET.get('brokername'),id=request.GET.get('id'),subscribe=True).last()
              if block :

                block.subscribe=False
                block.newevent=True

                block.save()    


                 
            
            return Response(
                {"message": "Successfully deleted"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
                        logger.error(e)
                        return Response(
                {"message": e},
                status=status.HTTP_400_BAD_REQUEST
            )




class loadaccount(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):


        try:
            users = request.user
            data= []
            print(request.GET.get('broker'))
            data1= dict()
            if request.GET.get('broker')=='all':
                datas= brokerlist
            if request.GET.get('broker').lower()== "shoonya":
  

                datas= md.Broker.objects.filter(user=users.id,brokername='SHOONYA').values('valid','brokerid','nickname','brokername','accountnumber','apikey','secretkey','password','vendorcode','AuthToken','active')
            elif request.GET.get('broker').lower()=='angel':
                datas= md.Broker.objects.filter(user=users.id,brokername='ANGEL').values('valid','brokerid','nickname','accountnumber','brokername','active','apikey','password','secretkey','AuthToken')
            
            elif request.GET.get('broker').lower()=='fyers':
                datas= md.Broker.objects.filter(user=users.id,brokername='FYERS').values('valid','brokerid','nickname','accountnumber','secretkey','AuthToken','active')
            

            elif request.GET.get('broker').lower()=='motilal':
                datas= md.Broker.objects.filter(user=users.id,brokername='MOTILAL').values('valid','brokerid','nickname','nickname','accountnumber','vendorcode','password','AuthToken','apikey','active')

            elif request.GET.get('broker').lower()=='groww':
                datas= md.Broker.objects.filter(user=users.id,brokername='GROWW').values('valid','brokerid','nickname','apikey','secretkey','active')
            
            elif request.GET.get('broker').lower()=='dhan':
                datas= md.Broker.objects.filter(user=users.id,brokername='DHAN').values('valid','brokerid','nickname','accountnumber','AuthToken','active','password')
            
            elif request.GET.get('broker').lower()=='upstox':
                datas= md.Broker.objects.filter(user=users.id,brokername='UPSTOX').values('valid','brokerid','nickname','accountnumber','AuthToken','active','apikey','secretkey')
            
            elif request.GET.get('broker').upper()=='ALICEBLUE':
                print('here')
                datas= md.Broker.objects.filter(user=users.id,brokername='ALICEBLUE').values('valid','brokerid','nickname','accountnumber','active','apikey','AuthToken','secretkey','password')

            elif request.GET.get('broker').upper()=='ZERODHA' or  request.GET.get('broker').upper()=='STOXKART'or request.GET.get('broker').upper()=='FLATTRADE' :
                print('here')
                datas= md.Broker.objects.filter(user=users.id,brokername=request.GET.get('broker').upper()).values('valid','brokerid','nickname','accountnumber','active','AuthToken','apikey','secretkey','password')

            elif request.GET.get('broker').upper()=='HDFC'  or request.GET.get('broker').upper()=='SYMPHONY' :
                print('here')
                datas= md.Broker.objects.filter(user=users.id,brokername=request.GET.get('broker').upper()).values('valid','brokerid','nickname','url','accountnumber','active','AuthToken','apikey','secretkey')
            elif request.GET.get('broker').upper()=='SAMCO'  :
                print('here')
                datas= md.Broker.objects.filter(user=users.id,brokername=request.GET.get('broker').upper()).values('valid','brokerid','nickname','accountnumber','active','password','secretkey')

                # datas = datas.to_dict(orient="records")

            return Response({"message":datas})

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

            dash=utility(user)
            oid=dash.checkfunds()
            data = md.Broker.objects.filter(user=user.id,valid= True).values('brokername','nickname','accountnumber','funds')
            # print(data)

            for i in range(len(data)):
                # print(i)
                # print(data[i]['funds'],'iiiii')
                
                if data[i]['funds'] != 'Unable to Fetch Login your account Again' and data[i]['funds']:
                    data[i]['funds']= format_in_indian_style(round(float(data[i]['funds']),2))



            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)


class getposition(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user

            dash=utility(user)

            oid=dash.getposition()
            data = md.Allpositions.objects.filter(user=user.id).values('nickname','tradingsymbol','netqty','buyavgprice','sellavgprice','ltp','broker','realised','unrealised')
            for i in range(len(data)):
                # print(i)
                # print(data[i]['funds'],'iiiii')
                
                if data[i]['realised']  :
                    print('here')
                    data[i]['realised']= format_in_indian_style(round(float(data[i]['realised']),2))
                if data[i]['unrealised']  :
                    print('here1')

                    data[i]['unrealised']= format_in_indian_style(round(float(data[i]['unrealised']),2))
                if data[i]['netqty']  :
                    print('here1')

                    data[i]['netqty']= format_in_indian_style(round(float(data[i]['netqty']),2))


            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)




class getholding(GenericAPIView):
    
    
    authentication_classes= (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user

            dash=utility(user)

            oid=dash.getholding()
            data = md.allholding.objects.filter(user=user.id).values('nickname','broker','tradingsymbol','quantity','T1quantity','averageprice','ltp','profitandloss')
            for i in range(len(data)):
                # print(i)
                # print(data[i]['funds'],'iiiii')
                
                if data[i]['profitandloss']:
                    data[i]['profitandloss']= format_in_indian_style(round(float(data[i]['profitandloss']),2))
                if data[i]['quantity']:
                    data[i]['quantity']= format_in_indian_style(round(float(data[i]['quantity']),2))
            


            return Response({"message":data})

        except Exception as e:
            print(e)
            return Response({
                    "message": [],
                    "code": status.HTTP_400_BAD_REQUEST
                },  
                status=status.HTTP_400_BAD_REQUEST)



