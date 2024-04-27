

mystack-dbaurorab-hf9pbgnqh67h.cdqegq646ysv.us-east-1.rds.amazonaws.com



wbe_bff
docker run -e "URL_BASE_BACKEND_SERVICES=http://internal-internalalb-103485813.us-east-1.elb.amazonaws.com:3000" -d --name web_bff  --network host kevin0988/web_bff

Customer backend
docker run -d --name customers_backend -p 3000:3000 kevin0988/customers_backend

Books backend 
docker run -d --name books_backend -p 3000:3000 kevin0988/books_backend


docker run -e "URL_BASE_BACKEND_SERVICES=http://internal-internalalb-103485813.us-east-1.elb.amazonaws.com:3000" -d --name mobile_bff  --network host kevin0988/mobile_bff
