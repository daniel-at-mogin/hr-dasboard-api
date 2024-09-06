import { query } from "../libs/pg"
import { Employee, Team, TeamUser } from "../types"

class TeamService {
  static CREATE_TEAM = async (team: Team) => {
    const result = await query<Team>(`
    INSERT INTO teams (
      name
    ) VALUES ($1)
    RETURNING *
    `, [team.name])

    return result?.rows.at(0)
  }

  static GET = async () => {
    const result = await query<Team>(`
      SELECT 
        * 
      FROM teams
      ORDER BY id ASC
    `)

    return result?.rows
  }

  static GET_BY_ID = async (team_id: number) => {
    const result = await query<Team>(`
    SELECT
      *
    FROM teams
    WHERE id=$1::integer
    `, [team_id])

    return result?.rows.at(0)
  }

  static GET_TEAM_MEMBER = async (team_id: number) => {
    const result = await query<Employee>(`
      SELECT
        u.email,
        u.full_name,
        u.username,
        u.phone,
        r.display_name AS role,
        u.level
      FROM team_user tu
      JOIN public."users" u ON tu.user_id=u.id
      JOIN roles r ON u.role_id=r.id
      WHERE team_id=$1::integer
    `, [team_id])

    return result?.rows
  }

  static ADD_MEMBER = async (user_id: number, team_id: number) => {
    const result = await query<TeamUser>(`
      INSERT INTO team_user (
        user_id,
        team_id
      ) VALUES ($1::integer, $2::integer)
      RETURNING *
    `, [user_id, team_id])

    return result?.rows.at(0)
  }

  static REMOVE_MEMBER = async (user_id: number, team_id: number) => {
    await query<TeamUser>(`
      DELETE FROM team_user
      WHERE user_id=$1::integer
      AND team_id=$2::integer
    `, [user_id, team_id])
  }

  static CHECK_MEMBER_EXISTANCE = async (user_id: number, team_id: number) => {
    const result = await query<number>(`
      SELECT
        *
      FROM team_user
      WHERE
        user_id=$1::integer
      AND team_id=$2::integer
    `, [user_id, team_id])

    return result?.rowCount ? true : false
  }

  static DELETE_TEAM = async (team_id: number) => {
    await query(`
      DELETE FROM teams
      WHERE id=$1::integer
    `, [team_id])

    await query(`
      DELETE FROM team_user
      WHERE team_id=$1::integer
    `, [team_id])
  }

  static CHECK_LEAD_EXISTENCE = async (team_id: number) => {
    const result = await query<number>(`
    SELECT 1 FROM team_user tu
    JOIN public."users" u ON tu.user_id = u.id
    WHERE tu.team_id = $1::integer
    AND u.level = 'lead'
  `, [team_id]);

    return result?.rowCount ? true : false;
  };
}

export default TeamService