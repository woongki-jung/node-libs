# env-initializer
nodejs 프로젝트에서 dotenv에 사용되는 .env 파일을 관리하기 위한 모듈입니다.
.env파일을 평문으로 배포 시, DB 연결문자열 등 민감한 데이터가 노출되는 것을 막기 위해 사용합니다.

# 기본 사용법
본 라이브러리는 dotenv, crypto-js를 참조하여 typescript로 작성되었습니다.

envInit()를 실행하여 .env파일의 값을 암/복호화할 수 있습니다.
envInit() 함수는 application 전반에서 process.env를 활용하기 수월하도록 시작 시점에 실행하는 것을 권장합니다.
실행 과정에서 process.env에 읽어들인 값을 병합합니다.
```nodejs
import { envInit } from 'env-initializer';

envInit({
    encKey: '암호화 키',
    appRootPath: '앱 실행 루트 경로',
})
```

nuxt등 runtime에서 개체를 넘겨줘야 하는 경우는 
getEnv()를 실행하여 .env파일의 값을 DotenvParseOutput 개체 형식으로 반환합니다.

```nodejs
import { getEnv } from 'env-initializer';

const env = getEnv({
    encKey: '암호화 키',
    appRootPath: '앱 실행 루트 경로',
});
```

envInit, getEnv는 다음 속성을 갖는 옵션을 넘겨줄 수 있습니다.
속성 | 형식 | 기본값 | 설명
---|---|---|---|
devSuffix? | string | 'dev' | 개발환경에서 사용되는 .env파일 접미사. -> .env.dev
prodSuffix? | string | 'prod' | 운영환경에서 사용될 값이 들어있는 .env파일 접미사. -> .env.prod
isDev? | boolean | - | 개발환경인지 여부. process.env.NODE_ENV !== 'production' 을 기본값으로 함. 직접 값을 넘겨주어 강제 설정 가능
appRootPath | string | - | 앱 실행 루트 경로. 해당 경로에 .env파일들이 있어야 함
encKey | string | - | 값 암복호화 시 사용할 암호화 키