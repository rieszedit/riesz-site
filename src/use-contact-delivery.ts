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
  const uncertainSubmission = useRef<ReturnType<typeof buildSubmission> | null>(null)
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
    if (uncertainSubmission.current) return uncertainSubmission.current
    if (status === 'success' && receipt) return receipt
    draftId.current ||= createSubmissionId()
    return buildSubmission(
      new FormData(formRef.current!),
      kind,
      draftId.current,
    )
  }

  function prepareFallback() {
    const submission = prepare()
    if (!uncertainSubmission.current) return submission
    return {
      ...submission,
      subject: `${submission.subject} | 受付確認 / Receipt check`,
      body: `フォーム送信の受付結果を確認できなかったため、下記の問い合わせが届いているかご確認ください。新規の依頼ではなく、送信時の控えです。\nPlease confirm whether the inquiry below was received. This is the original submission, not a new request.\n\n${submission.body}`,
    }
  }

  const onInput = useCallback(() => {
    if (pending.current) return
    for (const field of formRef.current?.querySelectorAll('input, textarea') ?? []) {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity('')
      }
    }
    if (!uncertainSubmission.current) {
      draftId.current = ''
      setStatus('idle')
      setReceipt(null)
    }
    setCopyState('idle')
    setManualCopy('')
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current || uncertainSubmission.current) return
    const form = event.currentTarget
    for (const field of form.querySelectorAll('input[required], textarea[required]')) {
      if (
        (field instanceof HTMLInputElement && ['text', 'email', 'url', 'tel', 'search'].includes(field.type)) ||
        field instanceof HTMLTextAreaElement
      ) {
        field.setCustomValidity(
          field.value.trim() ? '' : document.documentElement.lang === 'ja'
            ? '空白だけではなく、内容をご記入ください。'
            : 'Please enter a value, not only spaces.',
        )
      }
    }
    if (!form.reportValidity()) return
    pending.current = true
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
      const rejected = error instanceof Error &&
        /rejected|not accepted|endpoint/.test(error.message)
      // Keep the original attempt immutable until its receipt can be checked.
      if (!rejected) uncertainSubmission.current = submission
      setStatus(rejected ? 'error' : 'unknown')
    } finally {
      pending.current = false
      setChallengeReset((value) => value + 1)
    }
  }

  async function copy() {
    const submission = prepareFallback()
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
    const submission = prepareFallback()
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
