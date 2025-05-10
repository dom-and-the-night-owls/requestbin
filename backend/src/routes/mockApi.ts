import express, { Request, Response } from 'express';
import type { Request as RequestType } from '../types';

const router = express.Router();

let baskets: string[] = ["78ugqjy", "x06skz4", "5ce2eoa"];

let requests: RequestType[] = [
  {
    basketName: '78ugqjy',
    method: "POST",
    sentAt: "2025-05-08T05:45:50.361+10:00",
    headers: `
      Accept: */*
      Accept-Encoding: gzip, deflate
      Baggage: sentry-trace_id=8941d0f43423447997f42a2b5961b0a2,sentry-sample_rate=0.0001,sentry-sampled=false,sentry-environment=production,sentry-public_key=ecd2cbf917454e9daa40541c86d0cabf,sentry-transaction=Webhook%3A%3ADeliveryJob
      Connection: close
      Content-Length: 2864
      Content-Type: application/json
      Sentry-Trace: 8941d0f43423447997f42a2b5961b0a2-865e1f2fb5734a12-0
      Traceparent: 00-b257fa90247b0a17371c9ab7c2190ed9-b906a87984b49978-00
      User-Agent: Basecamp3 Webhook
      X-Country: US
      X-Forwarded-For: 204.62.114.248
      X-Real-Ip: 204.62.114.248
      X-Request-Id: fa4ebfb0-4285-4e8c-869f-a0bcabc00bb9
    `,
    requestBodyContentType: "application/json",
    requestBody: `
      {
        "id": 14140437567,
        "kind": "todo_uncompleted",
        "details": {},
        "created_at": "2025-05-08T05:45:50.361+10:00",
        "recording": {
          "id": 8365482963,
          "status": "active",
          "visible_to_clients": false,
          "created_at": "2021-10-07T21:33:00.812+11:00",
          "updated_at": "2025-05-08T05:45:50.359+10:00",
          "title": "More TypeScript",
          "inherits_status": true,
          "type": "Todo",
          "url": "https://3.basecampapi.com/3695031/buckets/41141693/todos/8365482963.json",
          "app_url": "https://3.basecamp.com/3695031/buckets/41141693/todos/8365482963",
          "bookmark_url": "https://3.basecampapi.com/3695031/my/bookmarks/BAh7BkkiC19yYWlscwY6BkVUewdJIglkYXRhBjsAVEkiLmdpZDovL2JjMy9SZWNvcmRpbmcvODM2NTQ4Mjk2Mz9leHBpcmVzX2luBjsAVEkiCHB1cgY7AFRJIg1yZWFkYWJsZQY7AFQ=--4fae6d7217c8eac3360eda2b6fe78b9ffc376e2b.json",
          "subscription_url": "https://3.basecampapi.com/3695031/buckets/41141693/recordings/8365482963/subscription.json",
          "position": 1,
          "parent": {
            "id": 8365482949,
            "title": "TypeScript",
            "type": "Todolist",
            "url": "https://3.basecampapi.com/3695031/buckets/41141693/todolists/8365482949.json",
            "app_url": "https://3.basecamp.com/3695031/buckets/41141693/todolists/8365482949"
          },
          "bucket": {
            "id": 41141693,
            "name": "2505 Jorge Arias",
            "type": "Project"
          },
          "creator": {
            "id": 21308738,
            "attachable_sgid": "BAh7BkkiC19yYWlscwY6BkVUewdJIglkYXRhBjsAVEkiKWdpZDovL2JjMy9QZXJzb24vMjEzMDg3Mzg_ZXhwaXJlc19pbgY7AFRJIghwdXIGOwBUSSIPYXR0YWNoYWJsZQY7AFQ=--75ce4fa88d455333068ce554dc9805c59f98c4ab",
            "name": "Srdjan",
            "email_address": "srdjan@launchschool.com",
            "personable_type": "User",
            "title": "",
            "bio": "",
            "location": "",
            "created_at": "2018-09-23T01:54:16.141+02:00",
            "updated_at": "2025-02-19T00:26:27.409+01:00",
            "admin": false,
            "owner": false,
            "client": false,
            "employee": false,
            "time_zone": "Europe/Belgrade",
            "avatar_url": "https://bc3-production-assets-cdn.basecamp-static.com/3695031/people/BAhpBEIlRQE=--50a82b36e62618d7468d91ca209c37061210ddd0/avatar?v=1",
            "can_ping": true,
            "can_manage_projects": true,
            "can_manage_people": true,
            "can_access_timesheet": false,
            "can_access_hill_charts": true
          },
          "content": "More TypeScript"
        },
        "creator": {
          "id": 47731498,
          "attachable_sgid": "BAh7BkkiC19yYWlscwY6BkVUewdJIglkYXRhBjsAVEkiKWdpZDovL2JjMy9QZXJzb24vNDc3MzE0OTg_ZXhwaXJlc19pbgY7AFRJIghwdXIGOwBUSSIPYXR0YWNoYWJsZQY7AFQ=--db4f8d41c584ecdc1bac4776bdb05f1b6c504c8d",
          "name": "Jorge Arias",
          "email_address": "jorgeariasgil@gmail.com",
          "personable_type": "User",
          "title": "",
          "bio": "",
          "location": "Melbourne, Australia ",
          "created_at": "2025-02-19T20:03:10.850+11:00",
          "updated_at": "2025-02-19T21:58:05.841+11:00",
          "admin": false,
          "owner": false,
          "client": false,
          "employee": false,
          "time_zone": "Australia/Melbourne",
          "avatar_url": "https://bc3-production-assets-cdn.basecamp-static.com/3695031/people/BAhpBCpT2AI=--818934fe6758f02c4d48cd57b3d7c4ad73e73292/avatar?v=1",
          "company": {
            "id": 3192864,
            "name": "Capstone"
          },
          "can_ping": true,
          "can_manage_projects": true,
          "can_manage_people": true,
          "can_access_timesheet": false,
          "can_access_hill_charts": true
        }
      }
    `
  },
  {
    basketName: 'x06skz4',
    method: "POST",
    sentAt: "2025-03-10T06:50:30.361+10:00",
    headers: `
      Accept: */*
      Connection: close
      Content-Length: 7782
      Content-Type: application/json
      User-Agent: GitHub-Hookshot/eea6a71
      X-Country: US
      X-Forwarded-For: 140.82.115.41
      X-Github-Delivery: 54418570-2b7a-11f0-966b-7f9c3c03aa56
      X-Github-Event: ping
      X-Github-Hook-Id: 545206700
      X-Github-Hook-Installation-Target-Id: 966504529
      X-Github-Hook-Installation-Target-Type: repository
      X-Real-Ip: 140.82.115.41
    `,
    requestBodyContentType: "application/json",
    requestBody: `
      {
        "zen": "Half measures are as bad as nothing at all.",
        "hook_id": 545206700,
        "hook": {
          "type": "Repository",
          "id": 545206700,
          "name": "web",
          "active": true,
          "events": [
            "*"
          ],
          "config": {
            "content_type": "json",
            "insecure_ssl": "0",
            "url": "https://rbaskets.in/78ugqjy"
          },
          "updated_at": "2025-05-07T19:34:44Z",
          "created_at": "2025-05-07T19:34:44Z",
          "url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/hooks/545206700",
          "test_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/hooks/545206700/test",
          "ping_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/hooks/545206700/pings",
          "deliveries_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/hooks/545206700/deliveries",
          "last_response": {
            "code": null,
            "status": "unused",
            "message": null
          }
        },
        "repository": {
          "id": 966504529,
          "node_id": "R_kgDOOZuwUQ",
          "name": "mongo_postgresql_simple_app",
          "full_name": "JorgeAndArias/mongo_postgresql_simple_app",
          "private": false,
          "owner": {
            "login": "JorgeAndArias",
            "id": 64111850,
            "node_id": "MDQ6VXNlcjY0MTExODUw",
            "avatar_url": "https://avatars.githubusercontent.com/u/64111850?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/JorgeAndArias",
            "html_url": "https://github.com/JorgeAndArias",
            "followers_url": "https://api.github.com/users/JorgeAndArias/followers",
            "following_url": "https://api.github.com/users/JorgeAndArias/following{/other_user}",
            "gists_url": "https://api.github.com/users/JorgeAndArias/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/JorgeAndArias/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/JorgeAndArias/subscriptions",
            "organizations_url": "https://api.github.com/users/JorgeAndArias/orgs",
            "repos_url": "https://api.github.com/users/JorgeAndArias/repos",
            "events_url": "https://api.github.com/users/JorgeAndArias/events{/privacy}",
            "received_events_url": "https://api.github.com/users/JorgeAndArias/received_events",
            "type": "User",
            "user_view_type": "public",
            "site_admin": false
          },
          "html_url": "https://github.com/JorgeAndArias/mongo_postgresql_simple_app",
          "description": null,
          "fork": false,
          "url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app",
          "forks_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/forks",
          "keys_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/keys{/key_id}",
          "collaborators_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/collaborators{/collaborator}",
          "teams_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/teams",
          "hooks_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/hooks",
          "issue_events_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/issues/events{/number}",
          "events_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/events",
          "assignees_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/assignees{/user}",
          "branches_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/branches{/branch}",
          "tags_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/tags",
          "blobs_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/git/blobs{/sha}",
          "git_tags_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/git/tags{/sha}",
          "git_refs_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/git/refs{/sha}",
          "trees_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/git/trees{/sha}",
          "statuses_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/statuses/{sha}",
          "languages_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/languages",
          "stargazers_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/stargazers",
          "contributors_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/contributors",
          "subscribers_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/subscribers",
          "subscription_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/subscription",
          "commits_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/commits{/sha}",
          "git_commits_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/git/commits{/sha}",
          "comments_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/comments{/number}",
          "issue_comment_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/issues/comments{/number}",
          "contents_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/contents/{+path}",
          "compare_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/compare/{base}...{head}",
          "merges_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/merges",
          "archive_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/{archive_format}{/ref}",
          "downloads_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/downloads",
          "issues_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/issues{/number}",
          "pulls_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/pulls{/number}",
          "milestones_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/milestones{/number}",
          "notifications_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/notifications{?since,all,participating}",
          "labels_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/labels{/name}",
          "releases_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/releases{/id}",
          "deployments_url": "https://api.github.com/repos/JorgeAndArias/mongo_postgresql_simple_app/deployments",
          "created_at": "2025-04-15T03:00:57Z",
          "updated_at": "2025-04-15T03:08:37Z",
          "pushed_at": "2025-04-15T03:08:32Z",
          "git_url": "git://github.com/JorgeAndArias/mongo_postgresql_simple_app.git",
          "ssh_url": "git@github.com:JorgeAndArias/mongo_postgresql_simple_app.git",
          "clone_url": "https://github.com/JorgeAndArias/mongo_postgresql_simple_app.git",
          "svn_url": "https://github.com/JorgeAndArias/mongo_postgresql_simple_app",
          "homepage": null,
          "size": 3216,
          "stargazers_count": 0,
          "watchers_count": 0,
          "language": "JavaScript",
          "has_issues": true,
          "has_projects": true,
          "has_downloads": true,
          "has_wiki": true,
          "has_pages": false,
          "has_discussions": false,
          "forks_count": 0,
          "mirror_url": null,
          "archived": false,
          "disabled": false,
          "open_issues_count": 0,
          "license": null,
          "allow_forking": true,
          "is_template": false,
          "web_commit_signoff_required": false,
          "topics": [],
          "visibility": "public",
          "forks": 0,
          "open_issues": 0,
          "watchers": 0,
          "default_branch": "main"
        },
        "sender": {
          "login": "JorgeAndArias",
          "id": 64111850,
          "node_id": "MDQ6VXNlcjY0MTExODUw",
          "avatar_url": "https://avatars.githubusercontent.com/u/64111850?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/JorgeAndArias",
          "html_url": "https://github.com/JorgeAndArias",
          "followers_url": "https://api.github.com/users/JorgeAndArias/followers",
          "following_url": "https://api.github.com/users/JorgeAndArias/following{/other_user}",
          "gists_url": "https://api.github.com/users/JorgeAndArias/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/JorgeAndArias/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/JorgeAndArias/subscriptions",
          "organizations_url": "https://api.github.com/users/JorgeAndArias/orgs",
          "repos_url": "https://api.github.com/users/JorgeAndArias/repos",
          "events_url": "https://api.github.com/users/JorgeAndArias/events{/privacy}",
          "received_events_url": "https://api.github.com/users/JorgeAndArias/received_events",
          "type": "User",
          "user_view_type": "public",
          "site_admin": false
        }
      }
    `
  },
  {
    basketName: '5ce2eoa',
    method: "POST",
    sentAt: "2025-03-10T06:50:30.361+10:00",
    headers: `
      POST /login HTTP/1.1
      Host: example.com
      Content-Type: application/x-www-form-urlencoded
      Content-Length: 38
    `,
    requestBodyContentType: "application/x-www-form-urlencoded",
    requestBody: "username=johndoe&password=123456"
  }
]

router.get('/baskets', (_req: Request, res: Response) => {
  res.status(200).json({ baskets });
});

router.get('/generate_name', (_req: Request, res: Response) => {
  const name: string = Math.random().toString(36).substring(2, 9);
  res.status(200).json({ name });
});

router.post('/baskets/:name', (req: Request<{ name: string }>, res: Response) => {
  const { name } = req.params;

  if (baskets.includes(name)) {
    res.status(409).json({ message: "Basket already exists"});
    return;
  }

  baskets.push(name);
  res.status(201).json({ message: `Basket ${name} created.`})
});

router.delete('/baskets/:name', (req: Request<{ name: string }>, res: Response) => {
  const { name } = req.params;

  if (!baskets.includes(name)) {
    res.status(404).json({ message: "Basket not found"});
    return;
  }

  baskets = baskets.filter(basket => basket != name);
  res.status(204).json();
});

router.get('/baskets/:name/requests', (req: Request<{ name: string }>, res: Response) => {
  const { name } = req.params;

  if (!baskets.includes(name)) {
    res.status(404).json({ message: "Basket not found"});
    return;
  }

  let requestsResponse: RequestType[] = requests.map((request) => {
    let typedRequest = request as RequestType;
    typedRequest.basketName = name;
    return typedRequest;
  });

  res.status(200).json({ requests: requestsResponse });
});

router.delete('/baskets/:name/requests', (req: Request<{ name: string }>, res: Response) => {
  const { name } = req.params;

  if (!baskets.includes(name)) {
    res.status(404).json({ message: "Basket not found"});
    return;
  }

  res.status(200).json();
});

router.get('/baskets/:name/purge', (req: Request, res: Response) => {
  const { name }  = req.params
  
  if (!baskets.includes(name)) {
    res.status(404).json({ message: "Basket not found"});
    return;
  }

  requests = requests.filter(requestObj => requestObj.basketName !== name);

  res.send(200).send();
})

export default router;