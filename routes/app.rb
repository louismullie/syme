get '/launch' do

  content_type 'text/html'
  
<<-EOF

<!DOCTYPE html>
<html lang="en">

<head>
</head>

<body>
Redirecting you to the Syme application...
<a href="chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani/syme.html"></a>
</body>

</html>

EOF
end