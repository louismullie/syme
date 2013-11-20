get '/launch' do

  content_type 'text/html'
  
<<-EOF

<!DOCTYPE html>
<html lang="en">

<head>

<script type="text/javascript" src="launch.js"></script>

</head>

<body>
Redirecting you to the Syme application...
</body>

</html>

EOF
end