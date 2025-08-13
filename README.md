# Faceless MVP

페이슬리스(얼굴 없는) 쇼츠 영상을 **프롬프트→스크립트→TTS→스톡/솔리드 비주얼→자막/워터마크→MP4**로 생성하는 MVP예요.

## 빠른 시작
1) Vercel에 이 저장소를 임포트하고, Railway에 워커를 배포합니다.
2) `.env`는 Vercel/ Railway의 환경변수에 그대로 넣으세요.
3) 순서대로 `/api/script → /api/tts → /api/assemble → /api/render` 호출 후 `/api/render/:id/status`로 결과 확인.

자세한 운영 가이드와 아키텍처는 별도 문서를 참고하세요.
