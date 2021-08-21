package plan

func (p Purchase) CanNotify() bool {
	if p.Notified {
		return false
	}
	if p.Purchased {
		return false
	}
	if p.Deleted {
		return false
	}
	n := now()
	if n.Before(*p.Date) {
		return false
	}
	return true
}
