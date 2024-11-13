variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_zone_id" {
  type = string
}

variable "mail_server_mx" {
  type = string
}

variable "mail_server_txt" {
  type = string
}


variable "domain_key" {
  type = string
}

variable "dmarc" {
  type = string
}
