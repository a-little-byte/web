cmd_Release/obj.target/hash.node := g++ -o Release/obj.target/hash.node -shared -pthread -rdynamic -m64  -Wl,-soname=hash.node -Wl,--start-group Release/obj.target/hash/src/main.o Release/obj.target/hash/src/pbkdf2.o Release/obj.target/hash/src/sha256.o Release/obj.target/hash/src/utils.o -Wl,--end-group 
