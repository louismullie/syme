get '/launch' do

  content_type 'text/html'
  
<<-EOF

<!DOCTYPE html>
<html lang="en">

<head>

<script type="text/javascript">
window.location = 'chrome-extension://kebgjahkgfpaeidbimpiefobehkjmani/syme.html';
</script>

</head>

<body>
Redirecting you to the Syme application...
</body>

</html>

EOF
end