import http.server
import socketserver
import webbrowser
import threading
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    webbrowser.open(f"http://localhost:{PORT}")

if __name__ == "__main__":
    # Change current working directory to script location
    if DIRECTORY:
        os.chdir(DIRECTORY)
    
    print(f"==================================================")
    print(f" Bird Tower Defense 로컬 게임 서버를 구동합니다.")
    print(f"==================================================")
    print(f"서버 주소: http://localhost:{PORT}")
    print(f"서버 폴더: {os.getcwd()}")
    print(f"브라우저를 열고 있습니다...")
    
    threading.Timer(1.0, open_browser).start()
    
    # Allow port reuse to avoid 'Address already in use' errors on quick restarts
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("서버가 가동되었습니다. 중지하려면 Ctrl+C를 누르세요.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버가 종료되었습니다. 이용해 주셔서 감사합니다!")
        sys.exit(0)
    except Exception as e:
        print(f"\n에러 발생: {e}")
        sys.exit(1)
