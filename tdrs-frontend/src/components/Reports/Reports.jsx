import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import Button from '../Button'
import { setYear, setStt } from '../../actions/reports'
import UploadReport from '../UploadReport'
import STTComboBox from '../STTComboBox'

/**
 * Reports is the home page for users to file a report.
 * The user can select a year
 * for the report that they would like to upload and then click on
 * `Search` to begin uploading files for that year.
 */
function Reports() {
  // The selected year in the dropdown tied to our redux `reports` state object
  const selectedYear = useSelector((state) => state.reports.year)
  // The selected stt in the dropdown tied to our redux `reports` state object
  const selectedStt = useSelector((state) => state.reports.stt)
  // The logged in user saved in our redux `auth` state object
  const user = useSelector((state) => state.auth.user)
  const isOFAAdmin =
    user && user.roles.some((role) => role.name === 'OFA Admin')
  const sttList = useSelector((state) => state.stts.sttList)

  const dispatch = useDispatch()
  const [isUploadReportToggled, setIsToggled] = useState(false)

  const handleSelect = ({ target: { value } }) => {
    setIsToggled(false)
    dispatch(setYear(value))
  }

  const handleSearch = () => {
    setIsToggled(true)
  }

  // Non-OFA Admin users will be unable to select an STT
  // prefer => `auth.user.stt`

  const selectStt = (value) => {
    dispatch(setStt(value))
  }

  const reportHeader = `${
    selectedStt
      ? `${
          sttList.find((stt) => stt.name.toLowerCase() === selectedStt).name
        } - `
      : ''
  }Fiscal Year ${selectedYear}`

  return (
    <>
      <div className={classNames({ 'border-bottom': isUploadReportToggled })}>
        <form>
          {isOFAAdmin && (
            <div className="usa-form-group maxw-mobile">
              <STTComboBox selectedStt={selectedStt} selectStt={selectStt} />
            </div>
          )}
          <label
            className="usa-label text-bold margin-top-4"
            htmlFor="reportingYears"
          >
            Fiscal Year (October - September)
            {/* eslint-disable-next-line */}
              <select
              className="usa-select maxw-mobile"
              name="reportingYears"
              id="reportingYears"
              onChange={handleSelect}
              value={selectedYear}
            >
              <option value="" disabled hidden>
                - Select Fiscal Year -
              </option>
              <option value="2020">2020</option>
              <option data-testid="2021" value="2021">
                2021
              </option>
            </select>
          </label>
          <Button className="margin-y-4" type="button" onClick={handleSearch}>
            Search
          </Button>
        </form>
      </div>
      {isUploadReportToggled && (
        <UploadReport
          header={reportHeader}
          handleCancel={() => setIsToggled(false)}
        />
      )}
    </>
  )
}

export default Reports
