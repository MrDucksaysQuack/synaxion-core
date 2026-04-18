# synaxion-core — Step 3 harness 산출물

Itemwiki 레포의 `contrib/synaxion-core/`에 **synaxion-core GitHub 레포 루트에 그대로 복사**할 파일을 둔다.

## synaxion-core 레포에 반영하는 방법

로컬에 synaxion-core 클론이 있다고 가정:

```bash
rsync -a --delete contrib/synaxion-core/harness/ ../synaxion-core/harness/
cp contrib/synaxion-core/install.sh ../synaxion-core/install.sh
cp contrib/synaxion-core/sync-harness.sh ../synaxion-core/sync-harness.sh
chmod +x ../synaxion-core/install.sh ../synaxion-core/sync-harness.sh
cd ../synaxion-core
git add harness install.sh sync-harness.sh
git commit -m "feat: harness 템플릿 + install.sh 추가"
git push -u origin main
```

(`../synaxion-core` 경로는 실제 클론 위치로 바꾼다.)

## Itemwiki에서 constitution 서브모듈로 바꾸기

인증된 환경에서만 `git submodule add`가 성공한다. 절차는 `docs/guides/SYNAXION_CORE_SUBMODULE.md`를 따른다.

## install.sh 사용 (서브모듈 연결 후)

```bash
cd /path/to/itemwiki   # 프로젝트 루트
bash docs/constitution/install.sh "Itemwiki" "packages/lib <- …"
```
