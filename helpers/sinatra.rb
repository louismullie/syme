def local_get(url)
  call(env.merge("PATH_INFO" => url)).last.join
end