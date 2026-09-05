import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import {
  buildSubmission,
  contactEmail,
  createSubmissionId,
  submitToFormspree,
} from './contact-delivery'
import type { ContactKind } from './contact-delivery'

export type SubmitStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'error'
  | 'unknown'

export function useContactDelivery(kind: ContactKind, onSuccess?: () => void) {
  const formRef = useRef<HTMLFormElement>(null)
  const pending = useRef(false)
  const draftId = useRef('')
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [receipt, setReceipt] = useState<ReturnType<
    typeof buildSubmission
  > | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>(
    'idle',
  )
  const [manualCopy, setManualCopy] = useState('')
  const [challengeReset, setChallengeReset] = useState(0)
  const [resetVersion, setResetVersion] = useState(0)

  useEffect(() => {
    if (status !== 'submitting') return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [status])

  function prepare() {
    if (status === 'success' && receipt) return receipt
    draftId.current ||= createSubmissionId()
    return buildSubmission(
      new FormData(formRef.current!),
      kind,
      draftId.current,
    )
  }

  const onInput = useCallback(() => {
    if (pending.current) return
    draftId.current = ''
    setStatus('idle')
    setReceipt(null)
    setCopyState('idle')
    setManualCopy('')
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    pending.current = true
    const form = event.currentTarget
    const submission = prepare()
    setReceipt(submission)
    setStatus('submitting')
    try {
      await submitToFormspree(form.action, submission.data)
      form.reset()
      setResetVersion((value) => value + 1)
      onSuccess?.()
      setStatus('success')
    } catch (error) {
      setStatus(
        error instanceof Error &&
          /rejected|not accepted|endpoint/.test(error.message)
          ? 'error'
          : 'unknown',
      )
    } finally {
      pending.current = false
      setChallengeReset((value) => value + 1)
    }
  }

  async function copy() {
    const submission = prepare()
    const text = `${submission.subject}\n\n${submission.body}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setManualCopy(text)
      setCopyState('manual')
    }
  }

  function email(event: MouseEvent<HTMLAnchorElement>) {
    if (pending.current) {
      event.preventDefault()
      return
    }
    const submission = prepare()
    event.currentTarget.href = `mailto:${contactEmail}?subject=${encodeURIComponent(submission.subject)}&body=${encodeURIComponent(submission.body)}`
  }

  return {
    formRef,
    status,
    receipt,
    onInput,
    onSubmit,
    copy,
    email,
    copyState,
    manualCopy,
    challengeReset,
    resetVersion,
  }
}
