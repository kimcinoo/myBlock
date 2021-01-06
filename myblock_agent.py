#!/usr/bin/python
import os
import BaseHTTPServer
import json
import re
from base64 import decodestring

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
      command = json.loads(body)

      #use system here as below
      if command['name'] == 'createProject' :
         print '[start] create project'
         os.system('tizen create web-project -n blocklyprj -p mobile-5.0 -t WebSinglePage -- /tmp')
         print '[end] create project'
      elif command['name'] == 'buildProject' :
         print '[start] build project'
         index_file = open('/tmp/blocklyprj/index.html', 'rt')
         content = index_file.read()
         index_file.close()
         # regular expression <body\_.\{-}body>
         content_new = re.sub('<body.*body>', command['code'], content, flags = re.DOTALL)
         index_file = open('/tmp/blocklyprj/index.html', 'wt')
         index_file.write(content_new)
         index_file.close()
         # build and packaging
         # fix error: Invalid file reference. An unsinged file was found
         os.system('cd /tmp/blocklyprj && rm -rf .manifest.tmp author-signature.xml signature1.xml')
         os.system('tizen build-web -- /tmp/blocklyprj')
         os.system('tizen package -t wgt -- /tmp/blocklyprj')
         print '[end] build project'
      elif command['name'] == 'installProject' :
         print '[start] install project'
         os.system('tizen install -n blocklyprj.wgt -- /tmp/blocklyprj')
         print '[end] install project'
      elif command['name'] == 'imageSend' :
         print '[start] image send'
         # print command['data']
         image_data = command['data'].split(",")
         image_data = image_data[1]
         fh = open('/tmp/blocklyprj/' + command['fname'], 'wb')
         fh.write(decodestring(image_data))
         fh.close()
         print '[end] image send'

print "Listening on port 8088..."
server = BaseHTTPServer.HTTPServer(("localhost", 8088), MyHandler)
server.serve_forever()
