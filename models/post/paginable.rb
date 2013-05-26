module Post::Paginable
  
  def page(page, per_page = 10)
    
    posts = self.desc(:updated_at).to_a
    page, size, = page - 1, posts.size
    index = page * per_page
  
    return [] if index > size
    return posts if size < per_page
    
    size - index <= per_page ? 
    posts[index..-1]         :
    posts[index..index+per_page-1]

  end

end