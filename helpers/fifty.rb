Fifty.helper :hidden_if, "
  function (condition) {
    console.log(condition);
    return (condition ? 'hidden' : '');
  }
"

Fifty.helper :foreach, %{

  function(arr,options) {
    if(options.inverse && !arr.length)
      return options.inverse(this);

    return arr.map(function(item,index) {

      item.$index             = index;
      item.$first             = index === 0;
      item.$last              = index === arr.length-1;
      item.$multiple_of_three = index % 3 == 0;

      return options.fn(item);
    }).join('');
  }

} # Fifty.helper :foreach

# Empty images to keep images from pushing layout down when loading
def empty_image
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
end