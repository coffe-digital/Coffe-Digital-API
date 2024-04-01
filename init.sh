#!/bin/bash

# Monitora o diretório e ajusta as permissões dos arquivos criados
while true; do
    inotifywait -r -e create /usr/src/api
    chmod -R 755 /usr/src/api
done
