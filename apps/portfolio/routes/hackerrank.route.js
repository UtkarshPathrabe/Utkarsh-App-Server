import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/badges').get((req, res) => {
  const userName = req?.query?.username ?? 'UtkarshPathrabe';
  fetch(`https://www.hackerrank.com/rest/hackers/${userName}/badges`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json;charset=UTF-8' },
  })
    .then((response) => response.json())
    .then((json) => res.send(json))
    .catch((err) => {
      console.log('Error in hackerrank badges. Details: ', err);
      res.send('Error');
    });
});

router.route('/scores').get((req, res) => {
  const userName = req?.query?.username ?? 'UtkarshPathrabe';
  fetch(`https://www.hackerrank.com/rest/hackers/${userName}/scores_elo`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json;charset=UTF-8' },
  })
    .then((response) => response.json())
    .then((json) => {
      const scoresData = [];
      for (let i = 0; i < json.length; i++) {
        if (
          json[i].hasOwnProperty('practice') &&
          json[i].practice.hasOwnProperty('score') &&
          json[i].practice.score > 0
        ) {
          scoresData.push({
            name: json[i].name,
            score: json[i].practice.score,
          });
        }
      }
      res.send(scoresData);
    })
    .catch((err) => {
      console.log('Error in hackerrank scores. Details: ', err);
      res.send('Error');
    });
});

const getDateDiffInDays = (date2, date1) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));

router.route('/submission_histories').get((req, res) => {
  const userName = req?.query?.username ?? 'UtkarshPathrabe';
  fetch(
    `https://www.hackerrank.com/rest/hackers/${userName}/submission_histories`,
    {
      method: 'GET',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
    },
  )
    .then((response) => response.json())
    .then((json) => {
      const availableTimeStamps = Object.keys(json).sort();
      const submissionsData = [];
      for (let i = 0; i < availableTimeStamps.length; i++) {
        if (
          i > 0 &&
          getDateDiffInDays(
            availableTimeStamps[i],
            availableTimeStamps[i - 1],
          ) > 1
        ) {
          const currentDate = new Date(availableTimeStamps[i]);
          currentDate.setDate(currentDate.getDate() - 1);
          submissionsData.push([currentDate.getTime(), 0]);
        }
        submissionsData.push([
          new Date(availableTimeStamps[i]).getTime(),
          parseInt(json[availableTimeStamps[i]]),
        ]);
        if (
          i < availableTimeStamps.length - 1 &&
          getDateDiffInDays(
            availableTimeStamps[i + 1],
            availableTimeStamps[i],
          ) > 1
        ) {
          const currentDate = new Date(availableTimeStamps[i]);
          currentDate.setDate(currentDate.getDate() + 1);
          submissionsData.push([currentDate.getTime(), 0]);
        }
      }
      res.send(submissionsData);
    })
    .catch((err) => {
      console.log('Error in hackerrank badges. Details: ', err);
      res.send('Error');
    });
});

export default router;