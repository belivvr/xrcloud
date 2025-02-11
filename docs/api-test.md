# XRCLOUD API Test를 위한 문서 (Documentation for XRCLOUD API Testing)

## 1. 테스트 환경 설정 (Test Environment Setup)
 * 본 문서는 curl로 xrcloud api를 테스트하기 위한 문서입니다.
   (This document is for testing xrcloud api using curl)
 * 테스트 api url (Test api url): https://xrcloud-api.dev.belivvr.com
 * xrcloud dev환경의 계정 (Account for xrcloud dev environment): 
   - 이메일 (Email): mediopia-dev@belivvr.si
   - 비밀번호 (Password): medi1234!@
   - xrcloud-api Key: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49
   - projectId: f546afbc-f33b-48f4-88d0-e9dd975dc0f5
   - sceneId: ed312748-775b-4f3d-b69d-a73df50d30d0
   - roomId: cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a

## 2. API 호출 예제 (API Call Examples)

### 1. 프로젝트 가져오기 (Get Project)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/projects/f546afbc-f33b-48f4-88d0-e9dd975dc0f5" -H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 2. 씬 목록 가져오기 (Get Scene List)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/scenes?projectId=f546afbc-f33b-48f4-88d0-e9dd975dc0f5" -H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 3. 씬 생성 URL 가져오기 (Get Scene Creation URL)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/scenes/get-creation-url?projectId=f546afbc-f33b-48f4-88d0-e9dd975dc0f5" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 4. 특정 씬 가져오기 (Get Specific Scene)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/scenes/ed312748-775b-4f3d-b69d-a73df50d30d0" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 5. 씬 삭제하기 (Delete Scene)
```
curl -X DELETE "https://xrcloud-api.dev.belivvr.com/api/scenes/{sceneId}" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 6. 방 생성하기 (Create Room)
```
curl -X POST "https://xrcloud-api.dev.belivvr.com/api/rooms" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49" \
-H "Content-Type: application/json" \
-d '{
  "projectId": "f546afbc-f33b-48f4-88d0-e9dd975dc0f5",
  "sceneId": "ed312748-775b-4f3d-b69d-a73df50d30d0",
  "name": "example room name",
  "returnUrl": "https://xrcloud-api.dev.belivvr.com/",
  "size": 10
}'
```

### 7. 방 목록 가져오기 (Get Room List)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/rooms?projectId=f546afbc-f33b-48f4-88d0-e9dd975dc0f5" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 8. 특정 방 가져오기 (Get Specific Room)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/rooms/cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a?userId=e2177291-bf5c-4a27-979b-23b1acd30735" -H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/rooms/cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a" -H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"

```

### 9. 방 업데이트하기 (Update Room)
```
curl -X PATCH "https://xrcloud-api.dev.belivvr.com/api/rooms/cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49" \
-H "Content-Type: application/json" \
-d '{
  "name": "updated room name",
  "size": 15,
  "returnUrl": "https://www.example.com/"
}'
```

### 10. 방 삭제하기 (Delete Room)
```
curl -X DELETE "https://xrcloud-api.dev.belivvr.com/api/rooms/{roomId}" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```

### 11. 방 로그 가져오기 (Get Room Logs)
```
curl -X GET "https://xrcloud-api.dev.belivvr.com/api/rooms/cfdd7716-4ed0-4db2-b7d6-93dc0ff72c2a/logs" \
-H "X-XRCLOUD-API-KEY: 6c9d54df277cbcb3516721963248c251f9f8ccf491218296782e433b6a8ceb49"
```
