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
	if p.Date == nil {
		return false
	}

	n := now()
	return !n.Before(*p.Date)
}
