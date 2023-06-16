import { createPdf } from 'pdfmake/build/pdfmake';
import * as _ from 'pdfmake/build/vfs_fonts.js';
import { TypeBlueprintText } from '@/lib/pixi-tools-v2/types/pixi-enums';
import { codingToolsBase64 } from './base64codingToolsLogo';
import { codingFactoryBase64 } from './base64codingFactoryLogo';

const _fonts = globalThis.pdfMake.vfs ?? _.pdfMake.vfs;

export function exportToPdf(childImages) {
  if (childImages.length === 0) return;

  const styles = {
    image: {
      alignment: 'center',
      marginBottom: 25,
    },
    text: {
      alignment: 'center',
    },
    logoLeft: {
      marginBottom: 50,
    },
    logoRight: {
      marginBottom: 50,
      marginLeft: 100,
    },
  };

  const data = {
    content: [],
    styles: styles
  };
  data.content.push({
    columns: [
      {
        style: 'logoLeft',
        image: codingToolsBase64,
        width: 65,
        height: 50,
      },{
        style: 'logo',
        image: codingFactoryBase64,
        width: 100,
        height: 50,
      }
    ],
    columnGap: 350,
  })
  for (let n = 0; n < childImages.length; n++) {
    if (childImages[n].isBlueprint == true) {
      if (childImages[n].typeBlueprint == 1) {
        data.content.push({
          style: 'text',
          text: TypeBlueprintText["1"],
          width: 200,
        })
      } else if (childImages[n].typeBlueprint == 2) {
        data.content.push({
          style: 'text',
          text: TypeBlueprintText["2"],
        })
      } else if (childImages[n].typeBlueprint == 3) {
        data.content.push({
          style: 'text',
          text: TypeBlueprintText["3"],
        })
      } else if (childImages[n].typeBlueprint == 4) {
        data.content.push({
          style: 'text',
          text: TypeBlueprintText["4"],
        })
      } else if (childImages[n].typeBlueprint == 5) {
        data.content.push({
          style: 'text',
          text: TypeBlueprintText["5"],
        })
      } else {
      }
      data.content.push({
        style: 'image',
        image: childImages[n].base64,
        width: 520,
        height: 300,
    
      });
    } else if (childImages[n].dimension.width > 520) {
      data.content.push({
        style: 'image',
        image: childImages[n].base64,
        width: 520,
        height: childImages[n].dimension.height,
      });
    } else {
      data.content.push({
        style: 'image',
        image: childImages[n].base64,
        width: childImages[n].dimension.width,
        height: childImages[n].dimension.height,
      });
    }
  }

  // @ts-ignore
  const pdfGenerator = createPdf(data, null, null, _fonts).open();
}
