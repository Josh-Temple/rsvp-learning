# ネットワーク・OS・インフラ 本編レビュー — 2026-09-29

基点: main `cdea334efa021351f86f3f8fced082876826eeac`

## 結論

既存の `network-os-infra-overview` は `SEED / 概要のみ` の入口として残し、本編7章を `COMPLETE v0.1` として追加した。

追加章:

1. `network-ip-routing` — IPアドレス・パケット・ルーティング
2. `network-tcp-udp-ports` — TCP・UDP・Portと通信の単位
3. `network-dns-name-resolution` — DNSと名前解決
4. `network-http-tls-path` — HTTP・TLSとブラウザからサーバーまで
5. `os-processes-execution` — OS・Process・Threadとプログラム実行
6. `os-memory-filesystems` — Memory・Filesystem・Storageの基本
7. `linux-observation-basics` — Linuxの基本操作とシステム観察

## 章構成

用語集として並べるのではなく、ブラウザからサーバーへ通信が届き、OS上のProcessが処理するまでを順に理解できる構成にした。

1. IPアドレス・パケット・ルーティング
2. TCP・UDP・Portと通信の単位
3. DNSと名前解決
4. HTTP・TLSとブラウザからサーバーまで
5. OS・Process・Threadとプログラム実行
6. Memory・Filesystem・Storageの基本
7. Linuxの基本操作とシステム観察

情報セキュリティコースとの重複を避け、防御策そのものより「基盤がどう動くか」と障害の切り分けを中心にした。

## 一次資料・公式資料のfresh確認

2026-09-29時点で次を確認した。

- RFC 8200 — IPv6
- RFC 9293 — TCP
- RFC 768 — UDP
- IANA Service Name and Transport Protocol Port Number Registry
- RFC 1034 / RFC 1035 — DNS
- RFC 9110 — HTTP Semantics
- RFC 8446 — TLS 1.3
- Linux Kernel documentation — /proc
- Linux Kernel documentation — Memory Management
- Filesystem Hierarchy Standard 3.0
- GNU Bash Reference Manual
- GNU Coreutils Manual

Filesystem Hierarchy Standardは2026-09-23公開の現行ページを確認した。教材ではDistribution固有の配置を普遍的な義務として扱わず、標準の射程を限定した。

## 内容品質

各章で定義だけでなく、処理の流れ、似た概念との違い、境界条件、障害の切り分けを扱った。

特に次を明示した。

- 名前 / IP / Portは別の概念
- IP / TCP・UDP / HTTPは別の層
- DNS成功は通信成功を保証しない
- TCP接続成功はApplication正常を保証しない
- HTTPSはApplication内容の正しさを保証しない
- Program / Process / Threadは別の概念
- 仮想Memory / 物理RAM / Storageは別の資源
- File削除と空き容量の回復が即時一致しない場合がある
- Processの存在はService正常を保証しない
- Linuxでは変更より先に観察する

## 同期検証

- `network-ip-routing`: Learn 1232字 / RSVP 48 chunks / max 21文字
- `network-tcp-udp-ports`: Learn 1208字 / RSVP 48 chunks / max 20文字
- `network-dns-name-resolution`: Learn 1198字 / RSVP 48 chunks / max 20文字
- `network-http-tls-path`: Learn 1329字 / RSVP 48 chunks / max 22文字
- `os-processes-execution`: Learn 1397字 / RSVP 48 chunks / max 23文字
- `os-memory-filesystems`: Learn 1502字 / RSVP 48 chunks / max 23文字
- `linux-observation-basics`: Learn 1499字 / RSVP 50 chunks / max 24文字

生成時に全7章で次を確認した。

- Markdown番号付き本文とRSVP JSON `chunks[].text` が一致
- MarkdownとJSONの出典が一致
- RSVPチャンクは24文字以内
- Learn本文は900字以上
- LearnはRSVPの単純連結ではなく音声向けに再構成
- Learn本文は初期DOMに存在
- 既存Web Speech APIプレイヤー構造を維持

以上から本編7章を `COMPLETE v0.1` と判定する。
