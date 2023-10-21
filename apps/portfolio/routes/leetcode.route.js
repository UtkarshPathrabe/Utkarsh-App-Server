import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

const leetcodePostBody = (userName) => ({
	operationName: 'getUserProfile',
	variables: {
		username: userName,
	},
	query:
		'query getUserProfile($username: String!) {\nallQuestionsCount {\ndifficulty\ncount\n}\nmatchedUser(username: $username) {\nusername\nprofile {\nstarRating\nranking\n}\nsubmissionCalendar\nbadges {\nid\ndisplayName\nicon\ncreationDate\nmedal{\nslug\nconfig{\nicon\niconGif\niconGifBackground\niconWearing\n__typename\n}\n __typename\n}\n__typename\n}\n\nsubmitStats {\nacSubmissionNum {\ndifficulty\ncount\nsubmissions\n}\ntotalSubmissionNum {\ndifficulty\ncount\nsubmissions\n}\n}\n}\n}\n',
});

router.route('/').get((req, res) => {
	const userName = req?.query?.username ?? 'Utkarsh_Pathrabe';
  fetch('https://leetcode.com/graphql', {
		method: 'POST',
		body: JSON.stringify(leetcodePostBody(userName)),
		headers: { 'Content-type': 'application/json;charset=UTF-8' },
	})
		.then((response) => response.json())
		.then((json) => res.send(json))
		.catch((err) => {
			console.log('Error in leetcode data. Details: ', err);
			res.send('Error');
		});
});

export default router;