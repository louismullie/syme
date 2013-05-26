module Post::Selectable
  
  # Selection helpers
  def year_span
    # Iterate using map instead of each
    self.last ? self.last.created_at.year
    .downto(self.first.created_at.year) : []
  end

  def in_year(year)
    self.between(created_at: Time.new(year) ..
    Time.new(year) + 1.year - 1 )
  end

  def in_month(year, month)
    self.between(created_at: Time.new(year, month) ..
    Time.new(year, month) + 1.month - 1 )
  end

end