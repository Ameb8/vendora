import { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';

import { useTenant } from '../contexts/TenantContext.jsx'

function SortableImage({ item, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card style={{ width: '6rem', margin: '0.5rem', touchAction: 'none' }} {...listeners}>
                <Card.Img
                    variant="top"
                    src={item.image.image}
                    style={{ userSelect: 'none', touchAction: 'none' }}
                />

                <Card.Body className="p-2 text-center">
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        onPointerDown={(e) => e.stopPropagation()} // prevents DnD from hijacking
                    >
                        Remove
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default function ImageManager({ getURL, addURL, deleteURL, orderURL, list }) {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const { currentTenant, loading } = useTenant();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor) // Add this line
    );

    const fetchImages = () => {
        const token = localStorage.getItem('token');
        fetch(getURL, {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => a.position - b.position);
                setImages(data);
            });
    };

    useEffect(() => {
        fetchImages();
    }, [getURL]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAdd = () => {
        if (!file) return;
        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('image', file);
        formData.append('list_name', list);

        console.log(`Add URL: ${addURL}`);

            fetch(addURL, {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
            },
            body: formData,
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to add image');
                return res.json();
            })
            .then(() => {
                setFile(null);
                fetchImages();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${deleteURL}${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to delete image with ID ${id}`);
            }

            // Refresh with latest state
            setImages(prev => prev.filter(img => img.id !== id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete image. Check console for details.');
        }
    };


    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = images.findIndex(img => img.id === active.id);
            const newIndex = images.findIndex(img => img.id === over.id);
            const newOrder = arrayMove(images, oldIndex, newIndex);
            setImages(newOrder);
        }
    };

    const applyReordering = () => {
        const token = localStorage.getItem('token');
        const orderedIds = images.map(item => item.id);

        fetch(orderURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                tenant_id: currentTenant.id,
                ordered_ids: orderedIds,
            }),
        }).then(() => alert('Reordering applied!'));
    };

    return (
        <div className="p-3">
            <h5>Image Manager</h5>

            <Form.Group controlId="formFile" className="mb-2">
                <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleAdd} disabled={!file} className="mb-3">Add Image</Button>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                    <Row>
                        {images.map(item => (
                            <Col xs="auto" key={item.id}>
                                <SortableImage item={item} onDelete={handleDelete} />
                            </Col>
                        ))}
                    </Row>
                </SortableContext>
            </DndContext>

            <Button variant="success" className="mt-3" onClick={applyReordering}>
                Apply Reordering
            </Button>
        </div>
    );
}


