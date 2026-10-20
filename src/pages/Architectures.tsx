import { useSearchParams } from 'react-router-dom';
import { catalog } from '../lib/content';
import { PageIntro } from '../components/Cards';
import { Diagram } from '../components/Diagram';
export default function Architectures() {
  const [params, setParams] = useSearchParams();
  const id = catalog.diagrams.some((d) => d.id === params.get('diagrama'))
    ? params.get('diagrama')!
    : 'rag';
  return (
    <>
      <PageIntro
        eyebrow="SISTEMAS, POR DENTRO"
        title="Uma arquitetura. Cada conexão."
        description="Selecione componentes, avance etapas e conecte o desenho ao código. Representações didáticas, sem simular chamadas reais."
      />
      <div
        className="filter-tabs"
        role="group"
        aria-label="Escolher arquitetura"
      >
        {catalog.diagrams.map((d) => (
          <button
            key={d.id}
            aria-pressed={id === d.id}
            onClick={() => setParams({ diagrama: d.id })}
          >
            {d.title}
          </button>
        ))}
      </div>
      <Diagram key={id} id={id} />
      <div className="notice">
        <strong>Como explorar</strong>
        <p>
          Clique em um componente ou use as setas. A reprodução percorre as
          etapas a cada 2,4 segundos e pode ser pausada. No fluxo FastAPI, os
          componentes apontam para arquivos reais do exemplo.
        </p>
      </div>
    </>
  );
}
