# key-maker-woongs

개발과정에서 필요한 각종 키 생성용 모듈입니다.

# 키 생성 옵션

영문 대/소문자, 숫자를 조합하여 입력 길이에 맞는 키값을 생성해 줍니다.

기본 옵션값은 다음과 같습니다.
속성 | 형식 | 기본값 | 설명
---|---|---|---|
len? | number | 8 | 키 생성 길이
offset? | number | 0 | 키 생성시 더해줄 보정값.
useUpperCase? | boolean | true | 키 생성시 영문 대문자 포함
useLowerCase? | boolean | true | 키 생성시 영문 소문자 포함
useNumber? | boolean | true | 키 생성시 영문 숫자 포함
usableChars? | string | - | 키 생성시 사용할 문자열 지정

# 함수

**getRandomKey(opt?)**

조건에 맞는 무작위 문자열을 반환합니다.

---

**getRandomId(opt?)**

getRandomKey의 확장. ID용으로 사용하기 좋도록 영문 대소문자, 12자를 기본 설정으로 사용합니다.

---

**IndexToKey(idx, opt?)**

범위 내에서 유일한 키값 문자열을 반환합니다.

길이 값과 포함 문자열에 따라 최대 - 최소 범위가 달라집니다.

생성가능 번호 수 = 사용가능 문자 수 ^ 생성할 키값 길이 - (사용가능 문자 수 ^ 생성할 키값 길이 - 1) - offset값

쿠폰번호 등과 같이 범위 내에서 겹치는 값이 나오면 안 되면서 키값을 직관적으로 유추하기 어렵게 하고자 하는 경우 사용 가능합니다.

ex 영문 소문자/숫자만 포함하여 1~10번까지의 키값으로 번호를 생성하는 경우 다음과 같이 생성됩니다.

3roleb, ud57eb, mzjsfb, epshab, 7a93ab, ywnobb, qi40bb, i5ivcb, aqygdb, 3be3db

---

**getUUID()**

UUID를 생성해 줍니다.
