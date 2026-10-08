# 情報セキュリティ本格学習 Course IV レビュー — 2026-10-08

Base main: `ddef353eaa69893d2138fecc2603507dd9cd5453`

## 目的

通信経路、境界防御、Endpoint、Cloud、Container、IoTを一つのInfrastructure securityとして接続し、Network内部やManaged serviceを暗黙に信頼しない判断力を作ります。

## Fresh source review

2026-10-08に、RFC 9846 TLS 1.3、RFC 9989 DMARC、NIST SP 800-207、NIST SP 800-124 Rev.2、NIST SP 800-190、NISTIR 8259 Series、CISA Cloud Security TRA v2、CIS Controls v8.1等を確認しました。

## Course IV

1. `security-communication-path-boundaries` — 通信経路とセキュリティ境界
2. `security-dns-tls-https` — DNS・TLS・HTTPS
3. `security-firewall-proxy-waf-ids-ips` — Firewall・Proxy・WAF・IDS/IPS
4. `security-segmentation-vpn-zero-trust` — セグメンテーション・VPN・Zero Trust
5. `security-email-spf-dkim-dmarc` — メール・SPF・DKIM・DMARC
6. `security-endpoint-hardening-edr-mdm` — Endpoint hardening・EDR・MDM
7. `security-cloud-shared-responsibility-iam-config` — Cloud責任分界・IAM・設定
8. `security-container-serverless-saas-iot` — Container・Serverless・SaaS・IoT

## QA

- security-communication-path-boundaries: chunks 50, max 22 chars
- security-dns-tls-https: chunks 48, max 24 chars
- security-firewall-proxy-waf-ids-ips: chunks 51, max 23 chars
- security-segmentation-vpn-zero-trust: chunks 51, max 23 chars
- security-email-spf-dkim-dmarc: chunks 51, max 24 chars
- security-endpoint-hardening-edr-mdm: chunks 55, max 24 chars
- security-cloud-shared-responsibility-iam-config: chunks 53, max 24 chars
- security-container-serverless-saas-iot: chunks 58, max 24 chars

Markdown / RSVP JSON / Learn HTMLを同期し、24文字超chunkなし。Learnは全Markdown本文項目を音声向け再確認として保持します。

## 次

Course V「AppSec・API・Software Supply Chain」へ進みます。
