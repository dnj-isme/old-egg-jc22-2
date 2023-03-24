export interface Voucher {
  id: string
  title: string
  description: string
  value: number
  valid_until: string
  used: boolean
  one_time: boolean
}

// ID          string    `json:"id"`
// Title       string    `json:"title"`
// Description string    `json:"description"`
// Value       int       `json:"value"`
// Status      string    `json:"status"`
// ValidUntil  time.Time `json:"valid_until"`