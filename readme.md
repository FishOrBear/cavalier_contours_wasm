
base:https://github.com/jbuckmccready/cavalier_contours
base:https://github.com/jbuckmccready/cavalier_contours_web_demo/tree/master/wasm


```typescript
import { initWasm, Polyline } from "cavalier_contours_wasm";

async function do()
{
    await initWasm();//await this

    let pl = new Polyline();//new

    pl.free();//free
}
```
