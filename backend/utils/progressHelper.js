// utils/progressHelper.js
const { Video, Exam, VideoProgress, UserExam, CourseProgress } = require('../models');
const { Op, fn, col } = require('sequelize');

/**
 * updateCourseProgress(userId, courseId)
 * - Video weight = 70%
 * - Exam weight = 30%
 * - A quiz is PASS if best percent >= 90
 */
async function updateCourseProgress(userId, courseId) {
  if (!userId || !courseId) throw new Error('userId and courseId required');

  // 1) Lấy danh sách videoId trong course
  const videos = await Video.findAll({ where: { courseId }, attributes: ['videoId'] });
  const videoIds = videos.map(v => v.videoId);
  const totalVideos = videoIds.length;

  // 2) Đếm số video user đã complete (dùng IN list)
  let completedVideos = 0;
  if (totalVideos > 0) {
    completedVideos = await VideoProgress.count({
      where: {
        userId,
        isCompleted: true,
        videoId: { [Op.in]: videoIds }
      }
    });
  }

  // 3) Exams: lấy danh sách examIds trong course
  const exams = await Exam.findAll({ where: { courseId }, attributes: ['examId'] });
  const examIds = exams.map(e => e.examId);
  const totalExams = examIds.length;

  // 4) Tính passedExams dựa trên best percent (MAX percent) per exam
  let passedExams = 0;
  if (totalExams > 0) {
    const bests = await UserExam.findAll({
      where: { userId, examId: { [Op.in]: examIds } },
      attributes: [
        'examId',
        [fn('MAX', col('percent')), 'bestPercent']
      ],
      group: ['examId']
    });

    for (const b of bests) {
      const bestPercent = parseFloat(b.get('bestPercent') || 0);
      if (bestPercent >= 90) passedExams++;
    }
  }

  // 5) Tính percent
  const videoPercent = totalVideos === 0 ? 0 : (completedVideos / totalVideos) * 70;
  const examPercent = totalExams === 0 ? 0 : (passedExams / totalExams) * 30;
  const totalPercent = Math.min(videoPercent + examPercent, 100);

  // 6) Lưu vào CourseProgress (cache)
  await CourseProgress.upsert({
    userId,
    courseId,
    videoPercent,
    examPercent,
    totalPercent
  });

  // Debug info để bạn xem trong logs
  console.debug('[updateCourseProgress] userId=%s courseId=%s totalVideos=%d completedVideos=%d totalExams=%d passedExams=%d -> video%%=%.2f exam%%=%.2f total%%=%.2f',
    userId, courseId, totalVideos, completedVideos, totalExams, passedExams, videoPercent, examPercent, totalPercent
  );

  return { videoPercent, examPercent, totalPercent, totalVideos, completedVideos, totalExams, passedExams };
}

module.exports = { updateCourseProgress };
