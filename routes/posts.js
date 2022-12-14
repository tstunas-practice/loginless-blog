const express = require("express");
const router = express.Router();

/**
 * 게시글 조회 API
 * - 제목, 작성자명, 작성 내용을 조회하기
 */
router.get("/:postId", (req, res) => {});

/**
 * 전체 게시글 목록 조회 API
 * - 제목, 작성자명, 작성 날짜를 조회하기
 * - 작성 날짜를 기준으로 내림차순 정렬하기
 */
router.get("/", (req, res) => {});

/**
 * 게시글 작성 API
 * - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
 */
router.post("/", (req, res) => {});

/**
 * 게시글 수정 API
 * - 입력된 비밀번호를 확인하여 수정
 */
router.put("/:postId", (req, res) => {});
/**
 * 게시글 삭제 API
 * - 입력된 비밀번호를 확인하여 삭제
 */
router.delete("/:postId", (req, res) => {});

module.exports = router;
