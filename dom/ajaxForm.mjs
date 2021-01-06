/**
 * Sends forms using AJAX POST requests, and displays a <template> message
 * @param {string=} formIdentifier
 * @param {function(HTMLFormElement): Boolean} validator
 * @param {string=} messageIdentifier
 * @param {string=} successMessageId
 * @param {string=} errorMessageId
 * @param {string=}endpoint
 * @param {function(HTMLFormElement)=} onSent
 * @param {function(HTMLFormElement, Response)=} onSuccess
 * @param {function(HTMLFormElement, ErrorEvent, Response)=} onError
 * @param {boolean=} resetOnSuccess
 * @return {void}
 */
const ajaxForm = ({
                    formIdentifier = 'data-ajax-form',
                    validator,
                    messageIdentifier = 'data-message',
                    successMessageId = 'success',
                    errorMessageId = 'error',
                    endpoint = '/',
                    onSent,
                    onSuccess,
                    onError,
                    resetOnSuccess = true,
                  } = {}) => {
  const $forms = document.querySelectorAll(`[${formIdentifier}]`)
  if (!$forms) return


  $forms.forEach(/** HTMLFormElement */ $form => {
    const $message = $form.querySelector(`[${messageIdentifier}]`)

    let pending = false

    const showMessage = templateId => {
      $message.innerHTML = ''
      const template = document.getElementById(templateId)
      const content = template.content.cloneNode(true)
      $message.appendChild(content)
    }

    $form.onsubmit = function (event) {
      event.preventDefault()
      if (pending) return

      if (typeof validator === 'function') {
        const validated = validator($form)
        if (!validated) {
          showMessage(errorMessageId)
          typeof onError === 'function' && onError($form, new ErrorEvent('Validation error'), null)
          return
        }
      }

      const headers = new Headers()
      headers.set("Content-Type", "application/x-www-form-urlencoded")
      const body = new URLSearchParams([...new FormData(this)]).toString()
      fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      })
        .then(res => {
          if (res.ok) {
            showMessage(successMessageId)
            resetOnSuccess && $form.reset()
            typeof onSuccess === 'function' && onSuccess($form, res)
          } else {
            showMessage(errorMessageId)
            typeof onError === 'function' && onError($form, null, res)
          }
        })
        .catch(error => {
          showMessage(errorMessageId)
          typeof onError === 'function' && onError($form, error, null)
        })
        .finally(() => {
          typeof onSent === 'function' && onSent($form)
          pending = false
        })
    }
  })
}

export default ajaxForm