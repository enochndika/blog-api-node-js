import { Response, Request } from 'express';
import ReportChildComment from '@/models/reportChildComment';

/* get all reports */
async function list(req: Request, res: Response) {
  const { page = 1, limit = 6 }: { page?: number; limit?: number } = req.query;

  try {
    const sortBy = req.query.sortBy ? req.query.sortBy : 'id';

    const { count, rows: data } = await ReportChildComment.findAndCountAll({
      order: [[sortBy.toString(), 'DESC']],
      limit: parseInt(String(limit), 10),
      offset: (page - 1) * limit,
    });
    res.json({
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(String(page), 10),
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

/* create a new report*/
async function create(req: Request, res: Response) {
  try {
    const report = new ReportChildComment({
      childCommentId: req.params.childCommentId,
      userId: req.params.userId,
      subject: req.body.subject,
    });
    await report.save();
    res.json(report);
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export { list, create };
