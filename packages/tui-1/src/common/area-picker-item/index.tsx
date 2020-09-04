import React, { useState, useMemo } from 'react'
import cx from 'classnames/bind'
import AareaPicker from '../../components/area-picker'
import AFormField from '../../components/form-field'
import { Noop } from '../../types'
import { flatArr } from '../../utils'

import './index.less'

type noop = () => {}

// 网格层级orgLevel 90170001
interface AreaPickerItemProps {
  form: any
  title?: string
  itemName: string
  limit?: number
  required?: boolean
  disabled?: boolean
  errorTip?: string
  lastLevel?: number
  textDomClassName?: string
  organizationListChild: (...args: any) => Promise<any> | noop
  organizationGetRoot: (...args: any) => Promise<any> | noop
}

const AreaPickerItem: React.FC<AreaPickerItemProps> = ({
  form,
  title = '',
  itemName,
  limit = 3,
  required = false,
  disabled = false,
  errorTip = '',
  lastLevel,
  textDomClassName,
  organizationListChild,
  organizationGetRoot
}) => {
  const [areaPickerVisible, setAreaPickerVisible] = useState(false)
  const { setFieldsValue, getFieldValue, setFields } = form

  const areaPickerChooseHandler = (val: any[]) => {
    let orgNameStr = ''
    let idStr = ''
    let orgCodeStr = ''
    const retArr = flatArr(
      val.map(arr => arr.filter((item: Noop) => item.checked))
    )
    retArr.forEach((item: Noop) => {
      orgNameStr += `${item.orgName};`
      idStr += `${item.id};`
      orgCodeStr += `${item.orgInternalCode};`
    })
    setFieldsValue({
      [itemName]: {
        orgNameStr: orgNameStr.slice(0, -1),
        idStr: idStr.slice(0, -1),
        orgCodeStr: orgCodeStr.slice(0, -1)
      }
    })
    if (lastLevel) {
      const isLastLevel = retArr[retArr.length - 1]?.orgLevel === lastLevel
      setFields({
        [itemName]: {
          value: getFieldValue(itemName),
          errors: [isLastLevel ? null : new Error(errorTip)]
        }
      })
    }
  }

  const renderPlaceValue = useMemo(() => {
    const value = getFieldValue(itemName)
    console.log(75, value)
    if (value && value.orgNameStr) {
      const { orgNameStr } = value
      return orgNameStr ? orgNameStr.replaceAll(';', '-') : null
    }
    return `请选择${title}`
  }, [getFieldValue(itemName), title])

  const areaPickerClose = () => {
    setAreaPickerVisible(false)
  }

  return (
    <>
      <AFormField
        form={form}
        label={title}
        required
        itemName={itemName}
        rules={[{ required, message: errorTip || `选择${title}` }]}
        content={
          <div
            className={cx('tui-areatext-dom', textDomClassName, {
              active: renderPlaceValue?.indexOf('请选择') > -1
            })}
            onClick={() => {
              if (!disabled) {
                setAreaPickerVisible(true)
              }
            }}
          >
            {renderPlaceValue}
          </div>
        }
      />
      <AareaPicker
        limit={limit}
        visible={areaPickerVisible}
        onChooseHandler={areaPickerChooseHandler}
        onModalClose={areaPickerClose}
        organizationListChild={organizationListChild}
        organizationGetRoot={organizationGetRoot}
      />
    </>
  )
}

export default AreaPickerItem
