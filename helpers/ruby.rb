class ::Array

  def join_english(string = "%d people")
    case
    when size == 0 then ''
    when size == 1 then first.to_s
    when (2..5).include?(size)
      self[0..-2].join(", ") +
      ' and ' + self[-1]
    when size > 5 then string %  size
    end
  end

end

class ::String

  def escape(format)
    case format
    when :html
      CGI.escapeHTML(str.to_s)
    when :url
      CGI.escape(str.to_s)
    end
  end

  def entropy
    e = 0
    0.upto(255) do |i|
      x = count(i.chr)/size.to_f
      if x > 0
        e += - x * Math.log(x)/Math.log(2.to_f)
      end
    end
    e
  end

  def slug

    fn = I18n.transliterate(self)
    .split(/(?<=.)\.(?=[^.])(?!.*\.[^.])/m)
    .map { |s| s.gsub /[^a-z0-9\-]+/i, '-' }
    .join('.')

    fn.chomp(File.extname(fn)) +
    File.extname(fn).downcase

  end

end

class ::Time

  def round_to_day
    Time.new(self.year, self.month, self.day)
  end

end


class ::Hash
  
  def to_struct
    Struct.new(*keys.map(&:intern)).new(*values)
  end
  
end