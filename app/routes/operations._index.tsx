import Card from 'react-bootstrap/Card'
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import { FormattedMessage, useIntl } from 'react-intl'
import { Await, useLoaderData } from '@remix-run/react'

import OperationTable from '../components/OperationTable'
import { setTitle } from '../lib/utils'

import { horizonRecordsLoaderWithDefer } from '~/lib/loader-util'
import Paging from '~/components/shared/Paging'
import { Suspense, useEffect } from 'react'

const RECORD_LIMIT = 30

export const loader = horizonRecordsLoaderWithDefer<ReadonlyArray<any>>(`operations`, RECORD_LIMIT)

export default function Operations() {
  const { response } = useLoaderData<typeof loader>()

  const { formatMessage } = useIntl()
  useEffect(() => {
    setTitle(formatMessage({ id: 'operations' }))
  }, [])

  return (
    <Container>
      <Row>
        <Card>
          <CardHeader>
            <FormattedMessage id="operations" />
          </CardHeader>
          <Card.Body>
            <Suspense
              fallback={<Spinner />}
            >
              <Await
                resolve={response}
                errorElement={
                  <p>Error loading data</p>
                }
              >
                {({ records, cursor, horizonURL }) =>
                  <Paging
                    baseUrl='/operations'
                    records={records}
                    currentCursor={cursor}>
                    <OperationTable
                      records={records}
                      compact={false}
                      horizonURL={horizonURL}
                    />
                  </Paging>
                }
              </Await>
            </Suspense>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}
