import React, { useCallback, useState, useMemo } from 'react'
import { Calendar } from 'antd-mobile'
import dayjs from 'dayjs'
import cx from 'classnames/bind'
import { moment2Date } from '../../utils'
import AFormField from '../../components/form-field'

import './index.less'

interface CalendarFormItemProps {
  label: string
  form: any
  itemName: string
  labelRequired?: boolean
  tips?: string
  defaultTimeValue?: any
  required?: boolean
}

const CalendarFormItem = ({
  label,
  required = false,
  tips = '',
  form,
  itemName
}: CalendarFormItemProps) => {
  const [calendarVisible, setCalendarVisible] = useState(false)

  const { getFieldValue, setFieldsValue } = form

  const calendarOnConfirm = (startTime: Date, endTime: Date): void => {
    const timeArr = [
      dayjs(startTime).format('YYYY-MM-DD'),
      dayjs(endTime).format('YYYY-MM-DD')
    ]
    setFieldsValue({
      [itemName]: timeArr
    })
    setCalendarVisible(false)
  }

  const renderCalendarText = useMemo(() => {
    const calendarArr = getFieldValue(itemName)
    if (calendarArr && calendarArr.length && calendarArr[0]) {
      return `${calendarArr[0].split(' ')[0]}~${calendarArr[1].split(' ')[0]}`
    }
    return tips || `请选择${label}`
  }, [getFieldValue(itemName)])

  const renderDefaultTimeValue = useCallback((): [Date, Date] => {
    const calendarArr = getFieldValue(itemName) as [Date, Date]
    if (calendarArr && calendarArr[0] && calendarArr[1]) {
      return [
        moment2Date(calendarArr[0]) as Date,
        moment2Date(calendarArr[1]) as Date
      ]
    }
    return [new Date(), new Date()]
  }, [getFieldValue(itemName)])

  return (
    <>
      <AFormField
        label={label}
        required={required}
        form={form}
        itemName={itemName}
        requiredTips={`请选择${label}`}
        controlClassName="tui-calendar-form"
        content={
          <div
            className={cx('text-dom', {
              active: renderCalendarText?.indexOf('请选择') > -1
            })}
            onClick={() => setCalendarVisible(true)}
          >
            {renderCalendarText}
          </div>
        }
      />
      <Calendar
        visible={calendarVisible}
        defaultValue={renderDefaultTimeValue()}
        onCancel={() => setCalendarVisible(false)}
        onConfirm={calendarOnConfirm}
      />
    </>
  )
}

export default CalendarFormItem
