FROM arm32v7/node

WORKDIR /app

RUN npm i npm@latest -g 

ADD ../run.sh /root/run.sh

EXPOSE 3000

CMD ["/root/run.sh"]
