import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../helper/async-helper";
import { Absence, ErrorResponse, SuccessResponse } from "../types";
import { query } from "../libs/pg";
import { StatusCodes } from "http-status-codes";
import AbsenceService from "../services/absence-service";

type AbsenceItem = {
  user_id?: number;
  name?: string;
  absences: Absence[]
}

type AbsenceRequest = Request<{}, any, {
  user_id: number;
  date: Date;
  type: 'WFH' | 'AL' | 'SL';
}>

type AbsenceResponse<TData> = Response<SuccessResponse<TData> | ErrorResponse>

type ApprovalDetails = {
  isApprovedByTeamLeader: boolean;
  date: Date;
} | {
  isApprovedByHr: boolean;
  date: Date;
};

type MutatedResult = {
  absenceId: number;
  absenceRequestedDate: Date;
  approvalStatus: boolean;
  approvalDetails: ApprovalDetails[];
  reason?: string;
};

// @desc  Get all absence for all user
// @route GET /api/absences
const getAbsenceData = asyncHandler(async (req: AbsenceRequest, res: AbsenceResponse<any>) => {
  const user_id = req.user?.id

  const result = await AbsenceService.GET_ALL()
  // const result = await AbsenceService.GET_BY_EMPLOYEE_ID(user_id)

  res.status(200).json({
    status: StatusCodes.OK,
    success: true,
    data: result
  })
});

const getAbsenceDataTest = asyncHandler(async (req: AbsenceRequest, res: AbsenceResponse<any>) => {
  const user_id = req.user?.id

  if (!user_id) {
    return res.status(400).json({
      status: 400,
      message: `User id is not specified`
    } as ErrorResponse)
  }

  const result = await AbsenceService.GET_BY_EMPLOYEE_ID(user_id)

  res.status(200).json({
    status: StatusCodes.OK,
    success: true,
    data: result
  })
});

// @desc  Add new absence data
// @route POST /api/absences
const createNewAbsence = asyncHandler(async (req: AbsenceRequest, res: AbsenceResponse<AbsenceItem>) => {
  const { user_id, date, type } = req.body

  const validationError = await validateAbsenceRequest(Number(user_id), date, type)
  if (validationError) {
    return res.status(400).json({
      status: 400,
      message: validationError
    } as ErrorResponse)
  }

  const result = await AbsenceService.STORE(req.body)

  res.json({
    status: StatusCodes.CREATED,
    success: true,
    message: "Absence data has been created successfully",
    data: result
  })
})

// @desc  Approve an absence data
// @route PUT /api/absences/:absence_id
const approveAbsenceData = asyncHandler(async (req: Request<{ absence_id: number }, any, { is_approved: boolean, reason?: string }>, res: AbsenceResponse<any>) => {
  const absence = {
    is_approved: Boolean(req.body.is_approved),
    reason: req.body.reason
  }
  const absence_id = Number(req.params.absence_id)


  const result = await AbsenceService.UPDATE_STATUS(absence_id, absence)

  res.json({
    status: StatusCodes.OK,
    success: true,
    message: `Absence data has been akwaokwao`,
    data: result
  })
})

const deleteAbsence = asyncHandler(async (req: Request, res: Response) => {
  const absence_id = Number(req.params.absence_id);

  await AbsenceService.DELETE(absence_id)

  res.json({
    status: StatusCodes.OK,
    success: true,
    message: `The absence has been deleted/canceled`,
  })
})

const validateAbsenceRequest = async (
  user_id: number,
  date: Date,
  type: 'WFH' | 'AL' | 'SL'
) => {
  const today = new Date()
  const requestDate = new Date(date)
  const options = { day: 'numeric', month: 'short', year: 'numeric' };

  const checkQuery = `
    SELECT
      COUNT(*) AS count,
      SUM(CASE WHEN type = 'WFH' THEN 1 ELSE 0 END) AS wfh_count,
      SUM(CASE WHEN type IN ('AL', 'SL') THEN 1 ELSE 0 END) AS al_sl_count
    FROM absences
    WHERE user_id = $1
      AND date >= date_trunc('day', $2::timestamp)
      AND date < date_trunc('day', $2::timestamp) + interval '1 day'
  `;

  const checkQueryResult = await query<{
    count: number;
    wfh_count: number;
    al_sl_count: number;
  }>(checkQuery, [user_id, date]);

  const { count, wfh_count, al_sl_count } = checkQueryResult.rows[0];

  if (count > 0) {
    return `You already applied ${type} on ${requestDate.toLocaleDateString(undefined, options).split('/').join('-')}`;
  }

  if (type === 'WFH' && wfh_count >= 3) {
    return `You have already reached the WFH limit for this week.`;
  }

  if (type === 'AL' || type === 'SL') {
    const checkYearlyLimitQuery = `
      SELECT COUNT(*)
      FROM absences
      WHERE user_id = $1
        AND date >= date_trunc('year', current_timestamp)
        AND date < date_trunc('year', current_timestamp) + interval '1 year'
        AND type IN ('AL', 'SL')
    `;
    const yearlyLimitResult = await query<{ count: number }>(checkYearlyLimitQuery, [user_id]);

    if (yearlyLimitResult.rows[0].count >= 12) {
      return `You have reached the annual limit of 12 AL and SL leaves.`;
    }
  }

  const dayOfWeek = requestDate.getDay();
  if ((dayOfWeek === 6) || (dayOfWeek === 0)) {
    return `You cannot take leaves at weekend`
  }

  return null
}

export {
  getAbsenceData,
  getAbsenceDataTest,
  createNewAbsence,
  approveAbsenceData,
  deleteAbsence,
} 