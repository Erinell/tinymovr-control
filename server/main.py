import asyncio
from json import dumps, loads
from json.decoder import JSONDecodeError
from sys import exit
from threading import Thread

from tinymovr.channel import ResponseError
from devices import process_api, api, user_ns

import websockets
import logging

logger = logging.getLogger('websockets')
logger.setLevel(logging.WARN)
logger.addHandler(logging.StreamHandler())

def format(id, data):
    return dumps({"id": id, "data": data})

class Config:
    SERVER_PORT = 8000
    PING_INTERVAL = 10 # default (20)

class BaseService:
    def __init__(self, websocket, db_session):
        self.ws = websocket
        self.incoming = asyncio.Queue()
        self.outgoing = asyncio.Queue()
        self.db = db_session

    async def send_session(self):
        await self.ws.send('{"session_id": 1}')

    async def get_message(self):
        message = await self.ws.recv()
        try:
            message = loads(message)
        except JSONDecodeError:
            message = message

        logger.debug(message)
        await self.incoming.put(message)

        if message["key"] == "ping":
            return await self.outgoing.put(format(message["id"], "Pong !"))

        if message["key"] == "definitions":
            return await self.outgoing.put(format(message["id"], dumps(api)))
        
        if message["key"] == "devices":
            return await self.outgoing.put(format(message["id"], dumps(list(user_ns))))

        try:
            value, info = process_api(message["key"], message["value"])
            if value != None:
                return await self.outgoing.put(format(message["id"], value))

        except ResponseError as e:
            logger.warning(e)
            # TODO: tenter reconnexion à un appareil
            # self.empty_queue()
            return await self.outgoing.put(format("1", "DEVICE_NOT_FOUND"))
        except Exception as e:
            logger.warning(e.args[0], message["key"], message["value"])

    async def send_message(self):
        message = await self.outgoing.get()
        if not isinstance(message, str):
            message = dumps(message)
        await self.ws.send(message)

    async def produce(self):
        # TODO: envoyer les données en continue
        # idée : le client envoi les requêtes (avec frequence ?)
        #        le serveur les enregistre et envoi en boucle ces requêtes
        # value, _ = process_api("tm1", "")
        # await self.ws.send(format("1", value))
        return not self.outgoing.empty()
    
    async def consume(self):
        ...
        # print('Consuming')

    def empty_queue(self):
        while not self.incoming.empty():
            self.incoming.get_nowait()
            self.incoming.task_done()
        while not self.outgoing.empty():
            self.outgoing.get_nowait()
            self.outgoing.task_done()

class WebsocketServer:
    def __init__(self, db_session=None):
        self.loop = asyncio.new_event_loop()
        # self.loop1 = asyncio.new_event_loop()
        self.db_session = db_session
        self.clients = set()

    def serve_forever(self):
        asyncio.set_event_loop(self.loop)
        server = websockets.serve(self.handler, '', Config.SERVER_PORT, ping_interval=None )
        print(f"Started websocket server on {Config.SERVER_PORT}")
        asyncio.get_event_loop().run_until_complete(server)
        asyncio.get_event_loop().run_forever()

    async def handler(self, websocket, path):
        # print(f"Received websocket client on {path}")
        self.clients.add(websocket)
        master = BaseService(websocket, self.db_session)
        await master.send_session()
        try:
            while websocket.open:
                listener_task = asyncio.ensure_future(master.get_message())
                producer_task = asyncio.ensure_future(master.produce())
                done, pending = await asyncio.wait(
                    [listener_task, producer_task],
                    return_when=asyncio.FIRST_COMPLETED,
                )
                if listener_task in done:
                    await master.consume()
                else:
                    listener_task.cancel()
                if producer_task in done:
                    if producer_task.result():
                        await master.send_message()
                else:
                    print("Cancelling producer")
                    producer_task.cancel()
        finally:
            self.clients.remove(websocket)

if __name__ == '__main__':
    try:
        db_session = None
        sock = WebsocketServer(db_session)
        thread = Thread(target=sock.serve_forever, daemon=True)
        thread.start()
        thread.join()
    except KeyboardInterrupt:
        exit(0)