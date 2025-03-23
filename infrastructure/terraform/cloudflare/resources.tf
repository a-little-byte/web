resource "cloudflare_dns_record" "send_mx_record" {
  zone_id  = var.cloudflare_zone_id
  name     = "send"
  content  = var.mail_server_mx
  type     = "MX"
  ttl      = "automatic"
  priority = "10"
}

resource "cloudflare_dns_record" "send_txt_record" {
  zone_id = var.cloudflare_zone_id
  name    = "send"
  content = var.mail_server_txt
  type    = "TXT"
  ttl     = "automatic"
}

resource "cloudflare_dns_record" "send_txt_record" {
  zone_id = var.cloudflare_zone_id
  name    = "resend._domainkey"
  content = var.domain_key
  type    = "TXT"
  ttl     = "automatic"
}

resource "cloudflare_dns_record" "dmarc_txt_record" {
  zone_id = var.cloudflare_zone_id
  name    = "_dmarc"
  content = var.dmarc
  type    = "TXT"
  ttl     = "automatic"
}
