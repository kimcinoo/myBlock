#!/usr/bin/python
import os
import BaseHTTPServer

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
   def do_GET(self):
      print "Start Get"
      self.send_response(200)
      self.send_header('content-type', 'text/plain')
      self.send_header('Access-Control-Allow-Origin', '*') 
      self.end_headers()
      self.wfile.write('get response')
      return

   def do_POST(self):
      print "Start Post"
      length = int(self.headers.getheader('content-length'))
      body = self.rfile.read(length)
      self.send_response(200)
      self.send_header('Access-Control-Allow-Origin', '*') 
      self.end_headers()
      self.wfile.write("post response")
      print body
      #use system here as below
      os.system('ls -al')

print "Listening on port 8088..."
server = BaseHTTPServer.HTTPServer(("localhost", 8088), MyHandler)
server.serve_forever()
