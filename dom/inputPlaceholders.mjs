const inputPlaceholders = () => {
  document.querySelectorAll('input:not([type=submit]):not([type=checkbox]):not([type=radio]), textarea').forEach($input => {
    $input.placeholder = $input.placeholder || ' '
  })
}

export default inputPlaceholders