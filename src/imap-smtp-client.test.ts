import { expect, test, describe } from 'vitest'
import { imapSearchFolders, parseImapSearchQuery } from './imap-smtp-client.js'

describe('parseImapSearchQuery', () => {
  test('to: becomes IMAP TO and does not leave leftover plain text', () => {
    expect(parseImapSearchQuery('to:shawn@mintlify.com')).toEqual({
      inFolder: undefined,
      searchCriteria: { to: 'shawn@mintlify.com' },
    })
  })

  test('in:sent selects Sent and is not searched as body text', () => {
    expect(parseImapSearchQuery('in:sent to:shawn@mintlify.com')).toEqual({
      inFolder: 'sent',
      searchCriteria: { to: 'shawn@mintlify.com' },
    })
    expect(parseImapSearchQuery('in:sent')).toEqual({
      inFolder: 'sent',
      searchCriteria: { all: true },
    })
  })

  test('in:sent with subject text searches subject or body in Sent', () => {
    expect(parseImapSearchQuery('in:sent Invoice for three-week work trial')).toEqual({
      inFolder: 'sent',
      searchCriteria: {
        or: [
          { subject: 'Invoice for three-week work trial' },
          { body: 'Invoice for three-week work trial' },
        ],
      },
    })
  })

  test('plain subject text searches subject or body', () => {
    expect(parseImapSearchQuery('Invoice for three-week work trial')).toEqual({
      inFolder: undefined,
      searchCriteria: {
        or: [
          { subject: 'Invoice for three-week work trial' },
          { body: 'Invoice for three-week work trial' },
        ],
      },
    })
  })

  test('in:inbox keeps a from: filter on Inbox', () => {
    expect(parseImapSearchQuery('in:inbox from:github')).toEqual({
      inFolder: 'inbox',
      searchCriteria: { from: 'github' },
    })
  })

  test('folder starred keeps flagged even with a from: filter', () => {
    expect(parseImapSearchQuery('from:github', { isStarred: true })).toEqual({
      inFolder: undefined,
      searchCriteria: { flagged: true, from: 'github' },
    })
  })
})

describe('imapSearchFolders', () => {
  test('mail search with no folder looks in Inbox and Sent', () => {
    expect(imapSearchFolders({
      inFolder: parseImapSearchQuery('to:shawn@mintlify.com').inFolder,
    })).toEqual(['inbox', 'sent'])
  })

  test('in:sent searches only Sent', () => {
    expect(imapSearchFolders({
      inFolder: parseImapSearchQuery('in:sent to:shawn@mintlify.com').inFolder,
    })).toEqual(['sent'])
  })

  test('in:inbox searches only Inbox', () => {
    expect(imapSearchFolders({
      inFolder: parseImapSearchQuery('in:inbox from:github').inFolder,
    })).toEqual(['inbox'])
  })

  test('mail list --folder keeps that mailbox when the query has no in:', () => {
    expect(imapSearchFolders({ folder: 'inbox' })).toEqual(['inbox'])
    expect(imapSearchFolders({ folder: 'sent' })).toEqual(['sent'])
  })

  test('in: in the query wins over --folder', () => {
    expect(imapSearchFolders({
      folder: 'inbox',
      inFolder: parseImapSearchQuery('in:sent to:shawn@mintlify.com').inFolder,
    })).toEqual(['sent'])
  })
})
