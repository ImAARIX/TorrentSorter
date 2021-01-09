# TorrentSorter

TorrentSorter is a Node.JS program that sort all of your torrents (for servers like Plex, etc... or just for fun!).
Tested with qBittorrent v4.3.2

## Installation

1st step: Install [Node.JS](https://nodejs.org/) from their website.

2nd step: Clone the repository

3rd step: Put the folder somewere (like the qBittorrent folder)

4th step: Modify the index.js file and add each files that you want to use as your libraries like that
![Installation](http://res.clementcorp.fr/caputres/Code_KZxBKD4dvD.png)
5th step: Use this command on a terminal:
```bash
npm install
```
6th step: Start qBittorrent (or other torrent downloader). Go to Tools -> Options -> Downloads -> Run external program on torrent completion and write:
```bash
node cmd /c "path/to/the/program/index.js" "%F"
```
7th step: Save!

All done!

## Contributing

Pull requests are welcome!
